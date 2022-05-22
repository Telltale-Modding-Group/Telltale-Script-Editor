import {BrowserWindow, dialog, shell} from 'electron';
import * as fs from 'fs/promises';
import {FileData, getFiles, getFilesInDirectory, getIPCMainChannelSource} from './utils';
import {createModInfo, EditorFile, Project} from '../shared/types';
import {
	RunProjectChannel,
	BuildProjectChannel, BuildProjectLogChannel,
	CreateDirectoryChannel,
	CreateFileChannel,
	CreateProjectDirectoryChannel,
	DeleteFileChannel,
	GetDirectoryChannel,
	GetFileContentsChannel, GetGamePathChannel,
	GetNewProjectLocationChannel,
	OpenInExplorerChannel,
	OpenProjectChannel,
	RenameFileChannel,
	SaveFileChannel
} from '../shared/Channels';
import * as path from 'path';
import {formatProjectName} from '../shared/utils';
import {exec, execFile} from 'child_process';
import {opendir} from 'fs/promises';
import {createWriteStream} from 'fs';
import {format} from 'date-fns';
import archiver from 'archiver';
import AdmZip from 'adm-zip';

const buildProject = (log: (message: string) => void) => async ({ projectPath, project }: { projectPath: string, project: Project }) => {
	log('============== Starting...');

	const projectDir = await fs.opendir(projectPath);

	const formattedProjectName = project.mod.name.replace(/[^/da-zA-Z]+/g, '');
	const tempPath = path.join(projectPath, 'Builds', 'temp');

	const rootLevelDirectories: FileData[] = [];
	const modFiles: string[] = [];

	for (const file of await getFilesInDirectory(projectDir)) {
		if (file.path.includes('Builds') || file.path.includes('temp')) continue;

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

			const resdescFileContents = `
--This file was automatically generated by the Telltale Script Editor, available at https://github.com/Telltale-Modding-Group/Telltale-Script-Editor"
--File assocated with '${project.mod.name}' by ${project.mod.author}, version ${project.mod.version}",
local set = {}
set.name = "${setName}"
set.setName = "${setName}"
set.descriptionFilenameOverride = ""
set.logicalName = "<${logicalName}>"
set.logicalDestination = "<>"
set.priority = ${project.mod.priority}"
set.localDir = _currentDirectory
set.enableMode = "{enablemode}"
set.version = "${setVersion}"
set.descriptionPriority = 0
set.gameDataName = "${setName} Game Data"
set.gameDataPriority = ${project.mod.priority}
set.gameDataEnableMode = "constant"
set.localDirIncludeBase = true
set.localDirRecurse = false
set.localDirIncludeOnly = nil
set.localDirExclude =
{
    "Packaging/"
    "_dev/"
}
set.gameDataArchives =
{
    _currentDirectory .. "${ttarchName}"
}
RegisterSetDescription(set)`;

			log(`============== Generating ${path.join(tempPath, resdescName)}...`);

			await fs.writeFile(resdescOutputPath, resdescFileContents);
			const process = exec(`resources\\ttarchext.exe -V 7 -e 0 67 "${resdescOutputPath}" "${tempPath}"`, (e, out, err) => {
				log(out);
				log(err);
			});
			await new Promise(resolve => process.addListener('close', resolve));

			log(`============== Finished generating ${path.join(tempPath, resdescName)}!`);

			modFiles.push(resdescName);
		}

		if (file.name.endsWith('.lua')) {
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

export const registerIPCHandlers = (window: BrowserWindow) => {
	const source = getIPCMainChannelSource(window);

	OpenProjectChannel(source).handle(() => {
		const getProjectPath = async (): Promise<{ root: EditorFile, tseproj: string } | undefined> => {
			const selection = await dialog.showOpenDialog({
				title: 'Open project directory',
				properties: [
					'openDirectory'
				]
			});

			if (selection.canceled) return;

			const projectPath = selection.filePaths[0];

			let root = await fs.opendir(projectPath);

			let tseprojFile;
			for await (const file of root) {
				if (file.name.includes('.tseproj')) {
					// If we've already found a .tseproj file and have found another, reject the directory
					// and warn the user.
					if (tseprojFile) {
						await dialog.showMessageBox({
							title: 'Open project directory',
							type: 'warning',
							message: 'Invalid directory chosen, found multiple .tseproj files! Only one .tseproj file should be present.'
						});

						return getProjectPath();
					}

					tseprojFile = file;
				}
			}

			// If no .tseproj files were found, reject the directory and warn the user.
			if (!tseprojFile) {
				await dialog.showMessageBox({
					title: 'Open project directory',
					type: 'warning',
					message: 'Invalid directory chosen, no .tseproj file found!'
				});

				return getProjectPath()
			}

			const tseproj = (await fs.readFile(path.join(projectPath, tseprojFile.name), { encoding: 'utf8' })).trim();

			// Normally I would have just reused the value from above, but the async iterator automatically closes
			// the handle after iteration is complete, meaning it now points to a closed handle, so I just reopen
			// that file handle.
			root = await fs.opendir(projectPath);

			return { root: await getFiles(root), tseproj };
		};

		return getProjectPath();
	});

	GetNewProjectLocationChannel(source).handle(() =>
		dialog.showOpenDialog({ title: 'Select New Project', properties: ['openDirectory'] })
			.then(selection => selection.canceled ? undefined : selection.filePaths[0])
	);

	CreateProjectDirectoryChannel(source).handle(async ({ projectPath, project }) => {
		const formattedProjectName = formatProjectName(project.mod.name);

		const newProjectPath = path.join(projectPath, formattedProjectName);
		await fs.mkdir(newProjectPath);

		const tseprojName = `${formattedProjectName}.tseproj`;

		await fs.writeFile(path.join(newProjectPath, tseprojName), JSON.stringify(project, null, 2));

		const root = await fs.opendir(newProjectPath);

		return { root: await getFiles(root) };
	});

	GetDirectoryChannel(source).handle(async path => {
		const root = await fs.opendir(path);

		return getFiles(root);
	});

	GetFileContentsChannel(source).handle(async path =>
		// TODO: We should probably handle errors here, e.g. user loads up project, deletes file in explorer.exe,
		//       then attempts to click on file in filetree
		// The .trim() ensures any weird empty space characters are removed, which makes life easier
		(await fs.readFile(path, { encoding: 'utf8' })).trim()
	);

	RenameFileChannel(source).handle(async ({ file, newName }) => {
		const newPath = path.join(path.dirname(file.path), newName);

		await fs.rename(file.path, newPath);

		return newPath;
	});

	OpenInExplorerChannel(source).listen(path => {
		shell.showItemInFolder(path);
	});

	SaveFileChannel(source).handle(({ path, contents }) => {
		// TODO: Handle errors
		return fs.writeFile(path, contents)
	})

	CreateFileChannel(source).handle(async ({ directoryPath, extension }) => {
		let index = 0;
		let filename = '';

		while (true) {
			filename = `NewFile${index > 0 ? `${index}` : ''}.${extension}`;

			try {
				await fs.writeFile(path.join(directoryPath, filename), '');
				break;
			} catch  {
				index++;
			}
		}

		return path.join(directoryPath, filename);
	});

	CreateDirectoryChannel(source).handle(async directoryPath => {
		let index = 0;
		let folderName = '';

		while (true) {
			folderName = `NewFolder${index > 0 ? `${index}` : ''}`;

			try {
				await fs.mkdir(path.join(directoryPath, folderName));
				break;
			} catch  {
				index++;
			}
		}

		return path.join(directoryPath, folderName);
	});

	DeleteFileChannel(source).handle(file => {
		return fs.rm(file.path, { recursive: true });
	});

	GetGamePathChannel(source).handle(async () => {
		await dialog.showMessageBox({
			title: 'Select executable',
			message: 'Please select the executable file for Telltale\'s The Walking Dead: Definitive Edition',
			type: 'warning'
		});

		const selection = await dialog.showOpenDialog({
			title: 'Select executable',
			filters: [{ name: 'exe', extensions: ['exe', '*'] }]
		});

		if (selection.canceled) return;

		return selection.filePaths[0];
	});

	const buildProjectLogChannel = BuildProjectLogChannel(source);
	const log = (message: string) => {
		buildProjectLogChannel.send(message);
	}

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
	BuildProjectChannel(source).handle(buildProject(log));

	RunProjectChannel(source).handle(async ({ buildZipPath, gamePath }) => {
		const archivesPath = path.join(path.dirname(gamePath), 'Archives');
		log(`============== Installing mod into ${archivesPath}...`);

		const zip = new AdmZip(buildZipPath);
		zip.extractAllTo(archivesPath, true);

		log('============== Mod installed! Launching game...');

		const game = execFile(gamePath, (error, stdout, stderr) => {
			log(stdout);
			log(stderr);
		});

		await new Promise(resolve => game.on('close', resolve));

		log('============== Game closed!');

		return;
	});
};