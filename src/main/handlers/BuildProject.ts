import {createModInfo, Project} from '../../shared/types';
import fs, {opendir} from 'fs/promises';
import path from 'path';
import {FileData, getFilesInDirectory} from '../utils';
import {exec} from 'child_process';
import {format} from 'date-fns';
import {createWriteStream} from 'fs';
import archiver from 'archiver';
import {getResdesc} from './ResdescUtils';

/**
 * 1. For each lua file recursively in the project, compile into identical directory structure but inside Builds/temp
 * 2. For each non (lua | tseproj) file, copy into identical directory structure but inside Builds/temp
 * 3. For each top level directory in project, create a _resdesc_50_LOGICALNAME_PROJECTNAME.lua in Builds/temp/lua
 *           THEN run ttarchext.exe -V 7 -e 0 67 "Builds/temp/lua/_resdesc_50_LOGICALNAME_PROJECTNAME.lua" "Builds/temp"
 *           THEN run ttarchext.exe -b 67 "Builds/temp/DIRECTORYNAME_PROJECTNAME.ttarch2" "Builds/temp/DIRECTORYNAME"
 *
 * 6. Create Builds/temp/modinfo_PROJECTNAME.json with ModDisplayName, ModVersion, ModAuthor, ModCompatibility, and ModFiles
 * 7. For each directory in Builds/temp, delete
 * 8. Create .zip of Builds/temp
 * 9. Delete Builds/temp
 */
export const buildProject = (log: (message: string) => void) => async ({ projectPath, project }: { projectPath: string, project: Project }) => {
	log('============== Starting...');

	const projectDir = await fs.opendir(projectPath);

	const formattedProjectName = project.mod.name.replace(/[^/da-zA-Z]+/g, '');
	const tempPath = path.join(projectPath, 'Builds', 'temp');

	const rootLevelDirectories: FileData[] = [];
	const modFiles: string[] = [];

	for (const file of await getFilesInDirectory(projectDir)) {
		if (file.path.includes('Builds') || file.path.includes('temp') || file.name.endsWith('.tseproj')) continue;

		const rootLevelDirectory = file.directory && path.dirname(file.path) === projectPath;
		if (rootLevelDirectory) {
			const directoryName = file.name;

			rootLevelDirectories.push(file);

			const logicalName = directoryName.replace(/WDC_pc_|_data/g, '');
			const resdescName = `_resdesc_50_${logicalName}_${formattedProjectName}.lua`;

			const resdescOutputPath = path.join(tempPath, 'lua', resdescName);
			await fs.mkdir(path.dirname(resdescOutputPath), {recursive: true});

			const setName = logicalName + formattedProjectName;
			const setVersion = logicalName !== 'DebugMenu' ? 'trunk' : 'dummydata';

			const ttarchName = `${directoryName}_${formattedProjectName}.ttarch2`;

			log(`============== Generating ${path.join(tempPath, resdescName)}...`);

			await fs.writeFile(resdescOutputPath, getResdesc(project, setName, setVersion, logicalName, ttarchName));
			const process = exec(`resources\\ttarchext.exe -V 7 -e 0 67 "${resdescOutputPath}" "${tempPath}"`, (e, out, err) => {
				log(out);
				log(err);
			});
			await new Promise(resolve => process.addListener('close', resolve));

			log(`============== Finished generating ${path.join(tempPath, resdescName)}!`);

			modFiles.push(resdescName);
		}
		else if (file.name.endsWith('.lua')) {
			const compiledLuaPath = file.path.replace(projectPath, path.join(projectPath, 'Builds', 'temp'));
			await fs.mkdir(path.dirname(compiledLuaPath), {recursive: true});

			log(`============== Compiling ${file.path} into ${compiledLuaPath}...`);

			const process = exec(`resources\\luac.exe -o "${compiledLuaPath}" "${file.path}"`, (e, out, err) => {
				log(out);
				log(err);
			});
			await new Promise(resolve => process.addListener('close', resolve));

			log(`============== Finished compiling ${file.path}!`);
		}
		else if (!file.directory) {
			await fs.copyFile(file.path, file.path.replace(projectPath, tempPath));
		}
	}

	log('============== Finished generating _resdesc_ files!');
	log('============== Generating ttarch2 archives...');

	for (const directory of rootLevelDirectories) {
		const ttarchName = `${directory.name}_${formattedProjectName}.ttarch2`;
		const ttarchFilePath = path.join(tempPath, ttarchName);

		log(`============== Generating ${ttarchFilePath} from ${directory.path}...`);

		const process = exec(`resources\\ttarchext.exe -b 67 "${ttarchFilePath}" "${path.join(tempPath, directory.name)}"`, (error, stdout, stderr) => {
			log(stdout);
			log(stderr);
		});
		await new Promise(resolve => process.addListener('close', resolve));

		log(`============== Finished generating ${ttarchFilePath}!`);

		modFiles.push(ttarchName);
	}

	log('============== Finished generating ttarch2 archives!');
	log('============== Creating modinfo...');

	const modInfo = createModInfo(project.mod.name, project.mod.version, project.mod.author, modFiles);

	await fs.writeFile(path.join(tempPath, `modinfo_${formattedProjectName}.json`), JSON.stringify(modInfo, null, 2));

	log('============== Finished creating modinfo!');
	log('============== Cleaning up temporary directories...');

	for await (const dirette of await opendir(tempPath)) {
		if (!dirette.isDirectory()) continue;

		await fs.rm(path.join(tempPath, dirette.name), {recursive: true});
	}

	log('============== Finished cleaning up temporary directories!');

	const zipFileName = `build-${format(new Date(), "yyyy-MM-dd'T'HH-mm-ss")}.zip`;
	log(`============== Creating ${zipFileName}...`);

	const zipFilePath = path.join(projectPath, 'Builds', zipFileName);
	const zipFile = createWriteStream(zipFilePath);
	const zip = archiver('zip', {zlib: {level: 9}});
	zip.pipe(zipFile);
	zip.directory(tempPath, false);
	await zip.finalize();

	log(`============== ${zipFileName} has been generated!`);
	log('============== Cleaning up...');

	await fs.rm(tempPath, {recursive: true});

	log('============== Done!');

	return zipFilePath;
}