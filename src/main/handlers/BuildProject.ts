import { AppState, createModInfo, Project } from '../../shared/types';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { format } from 'date-fns';
import { createWriteStream } from 'fs';
import archiver from 'archiver';
import { generateResourceDescriptionContents, ResourceDescription } from './ResdescUtils';
import crypto from 'crypto';
import { getFilesInDirectory } from '../utils';

const generateHash = (string: string) => {
	const hash = crypto.createHash('md5');
	hash.update(string);

	return hash.digest('hex');
}

const generateHashForFile = async (path: string) => {
	const fileContents = await fs.readFile(path, 'utf8');

	return generateHash(fileContents);
}

type Hash = string;
type Cache = { tseproj?: Hash } & Record<string, Record<string, Hash>>;
export type Logger = (message: string) => void;

const formatProjectName = (project: Project) => project.mod.name.replace(/[^/da-zA-Z]+/g, '');
const generateTtarchName = (project: Project, archive: string) => `${archive}_${formatProjectName(project)}.ttarch2`;
const generateLogicalName = (archive: string) => archive
	.replace(/\..*?$/g, '')
	.replaceAll('WDC_pc_', '')
	.replaceAll('_data', '');
const generateResourceDescriptionName = (project: Project, resdesc: ResourceDescription) => `_resdesc_50_${generateLogicalName(resdesc.ttarchName)}.lua`;

const createResourceDescription = (project: Project, archive: string): ResourceDescription => {
	const formattedProjectName = formatProjectName(project);

	const logicalName = generateLogicalName(archive);

	const setName = logicalName + formattedProjectName;
	let enableMode = "constant";
	let setVersion = "dummydata";

	if(logicalName !== "DebugMenu") {
		enableMode = "bootable";
		setVersion = "trunk";
	}

	const ttarchName = generateTtarchName(project, archive);

	return {
		setName,
		priority: project.mod.priority,
		enableMode,
		setVersion,
		ttarchName
	};
};

const writeResourceDescription = async (project: Project, resdesc: ResourceDescription, cachePath: string, log: Logger) => {
	const resdescOutputPath = path.join(cachePath, generateResourceDescriptionName(project, resdesc));

	await fs.mkdir(path.dirname(resdescOutputPath), {recursive: true});

	await fs.writeFile(resdescOutputPath, generateResourceDescriptionContents(project, resdesc));
	const process = exec(`resources\\ttarchext.exe -V 7 -e 0 -o 67 "${resdescOutputPath}" "${cachePath}"`, (e, out, err) => {
		log(out);
		log(err);
	});

	await new Promise(resolve => process.addListener('close', resolve));
};

const compileLua = async (filePath: string, projectPath: string, cachePath: string, log: Logger) => {
	const compiledLuaPath = filePath.replace(projectPath, cachePath);
	await fs.mkdir(path.dirname(compiledLuaPath), {recursive: true});

	let error;
	const process = exec(`resources\\luac.exe -o "${compiledLuaPath}" "${filePath}"`, async (e, out, err) => {
		if (err) {
			log(err);

			error = err;
		}
	});
	await new Promise(resolve => process.addListener('close', resolve));

	if (error) throw new Error(error);
};

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
export const buildProject = async (log: Logger, state: AppState, { projectPath, project }: { projectPath: string, project: Project }): Promise<string | undefined> => {
	const buildsPath = path.join(projectPath, 'Builds');
	const tempPath = path.join(buildsPath, 'temp');
	const cachePath = path.join(buildsPath, 'cache');
	const formattedProjectName = project.mod.name.replace(/[^/da-zA-Z]+/g, '');

	log('============== Clearing any existing temp files...');
	try {
		await fs.rm(tempPath, { recursive: true });
		// eslint-disable-next-line no-empty
	} catch {}

	let previousCache: Cache;

	try {
		const cacheFile = await fs.readFile(path.join(cachePath, 'cache.json'), 'utf8');
		log('============== Loading cache from previous builds...');
		previousCache = JSON.parse(cacheFile);
	} catch {
		previousCache = {};
	}

	const newCache: Cache = {};

	const tasks: Promise<unknown>[] = [];

	const modFiles: string[] = [];

	const generateTtarchArchives = new Set<string>();
	const projectDir = await fs.opendir(projectPath);
	let generateResourceDescriptions = false;
	for await (const projectFile of projectDir) {
		const projectFilePath = path.join(projectPath, projectFile.name);
		const archiveName = projectFile.name;

		if (projectFile.name.endsWith('.tseproj')) {
			const hash = await generateHashForFile(projectFilePath);
			newCache.tseproj = hash;

			generateResourceDescriptions = hash !== previousCache.tseproj;
			continue;
		}

		if (!projectFile.isDirectory() || archiveName === 'Builds') continue;

		const currentArchiveCache: Cache[string] = {};

		const archiveDir = await fs.opendir(projectFilePath);
		for await (const archiveFile of archiveDir) {
			if (archiveFile.isDirectory()) continue;
			const archiveFileName = archiveFile.name;
			const archiveFilePath = path.join(projectFilePath, archiveFileName);

			const hash = await generateHashForFile(archiveFilePath);
			currentArchiveCache[archiveFileName] = hash;

			if (hash === previousCache[archiveName]?.[archiveFileName]) continue;

			generateTtarchArchives.add(archiveName);

			if (archiveFileName.endsWith('.lua')) {
				tasks.push(compileLua(archiveFilePath, projectPath, cachePath, log));
			} else {
				tasks.push(fs.cp(archiveFilePath, path.join(cachePath, archiveName, archiveFileName), {recursive: true}));
			}
		}

		newCache[archiveName] = currentArchiveCache;

		if (!previousCache[archiveName] || generateResourceDescriptions) {
			if (generateResourceDescriptions) {
				log('============== Project settings updated since previous build, generating resource description...');
			} else {
				log('============== New archive found, generating resource description...');
			}

			const resdesc = createResourceDescription(project, archiveName);
			const resdescName = generateResourceDescriptionName(project, resdesc);

			modFiles.push(resdescName);

			log(`============== Generating ${resdescName}...`);

			tasks.push(writeResourceDescription(project, resdesc, cachePath, log));
			continue;
		}

		Object.keys(previousCache[archiveName]).forEach(file => {
			// If the previous cache has a file that the current archive doesn't have, it must have been deleted.
			// Clear the previous cache for that file.
			if (!currentArchiveCache[file]) {
				log(`============== Clearing cached file ${file} as it is no longer needed...`);
				generateTtarchArchives.add(archiveName);
				tasks.push(fs.rm(path.join(cachePath, archiveName, file), { recursive: true }).catch());
			}
		})
	}

	Object.keys(previousCache).forEach(archive => {
		// If the previous cache has an archive that the current project doesn't have, it must have been deleted.
		// Clear the previous cache for that archive.
		if (!newCache[archive]) {
			log(`============== Clearing cached archive ${archive} as it is no longer needed...`);
			tasks.push(fs.rm(path.join(cachePath, archive), { recursive: true }));
		}
	});

	try {
		await Promise.all(tasks);
	} catch (e) {
		log(`============== There was an error building the project!`);
		log(`${e}`);

		return;
	}

	if (generateTtarchArchives.size === 0 && !generateResourceDescriptions) {
		log('============== No changes were detected! Skipping build...');

		const buildsDir = await fs.readdir(buildsPath);
		let zipPath;
		for (const file of buildsDir) {
			if (!file.endsWith('.zip')) continue;

			zipPath = path.join(buildsPath, file);
		}

		return zipPath;
	}

	const ttarchTasks: Promise<unknown>[] = [];
	generateTtarchArchives.forEach(archive => {
		const archivePath = path.join(cachePath, archive);

		const ttarchName = `${archive}_${formattedProjectName}.ttarch2`;

		modFiles.push(ttarchName);

		const ttarchFilePath = path.join(cachePath, ttarchName);

		log(`============== Generating ${ttarchFilePath} from ${archivePath}...`);

		const process = exec(`resources\\ttarchext.exe -b -o 67 "${ttarchFilePath}" "${archivePath}"`, (error, stdout, stderr) => {
			log(stdout);
			log(stderr);
		});

		ttarchTasks.push(new Promise(resolve => process.addListener('close', resolve)));
	});

	await Promise.all(ttarchTasks);

	await fs.mkdir(tempPath, {recursive: true});

	const tempDirTasks: Promise<unknown>[] = [];

	log('============== Creating modinfo file...');
	const modInfo = createModInfo(project.mod.name, project.mod.version, project.mod.author, modFiles);
	tempDirTasks.push(fs.writeFile(path.join(tempPath, `modinfo_${formattedProjectName}.json`), JSON.stringify(modInfo, null, 2)));

	log('============== Building temp directory from cache...');
	const cacheDir = await fs.opendir(cachePath);
	for await (const file of cacheDir) {
		if (file.isDirectory() || (!file.name.endsWith('.ttarch2') && !file.name.endsWith('.lua'))) continue;

		tempDirTasks.push(fs.cp(path.join(cachePath, file.name), path.join(tempPath, file.name), {recursive: true}));
	}

	await Promise.all(tempDirTasks);

	const zipFileName = `build-${format(new Date(), "yyyy-MM-dd'T'HH-mm-ss")}.zip`;
	log(`============== Creating ${zipFileName}...`);

	const zipFilePath = path.join(projectPath, 'Builds', zipFileName);
	const zipFile = createWriteStream(zipFilePath);
	const zip = archiver('zip', {zlib: {level: 9}});
	zip.pipe(zipFile);
	zip.directory(tempPath, false);
	await zip.finalize();

	log('============== Updating cache...');
	await fs.writeFile(path.join(cachePath, 'cache.json'), JSON.stringify(newCache));

	log('============== Cleaning up...');
	await fs.rm(tempPath, {recursive: true});

	const maximumBuildsToKeep = state.storage.maximumBuildsToKeep;
	if (maximumBuildsToKeep > 0) {
		const buildsDirectory = await fs.opendir(buildsPath);
		const buildsDirectoryFiles = await getFilesInDirectory(buildsDirectory);

		// There may be other files present in the Builds directory, no need to touch those
		const builds = buildsDirectoryFiles.filter(file => file.name.match(/build-.+?\.zip/g));
		if (builds.length > maximumBuildsToKeep) {
			const totalBuildsToRemove = builds.length - maximumBuildsToKeep;
			log(`============== Removing ${totalBuildsToRemove} old build${totalBuildsToRemove !== 1 ? 's' : ''}...`);

			const oldBuilds = builds.slice(0, totalBuildsToRemove);
			for (const oldBuild of oldBuilds) {
				log(`============== Removing ${oldBuild.path}...`);
				await fs.rm(oldBuild.path, { recursive: true });
			}
		}
	}

	log('============== BUILD SUCCESSFUL!');

	return zipFilePath;
}