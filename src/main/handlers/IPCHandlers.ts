import {BrowserWindow, dialog, shell, Menu} from 'electron';
import * as fs from 'fs/promises';
import * as fsNormal from 'fs';
import { getFiles, getFilesInDirectory, getIPCMainChannelSource, openBuildsDirectory } from '../utils';
import { AppState, EditorFile, generateModInfoFilename, ModInfo } from '../../shared/types';
import {
	BuildProjectChannel,
	BuildProjectLogChannel,
	CreateDirectoryChannel,
	CreateFileChannel,
	CreateProjectDirectoryChannel,
	DeleteFileChannel,
	GetDirectoryChannel,
	GetFileContentsChannel,
	GetGamePathChannel, GetLocalStoreChannel,
	GetNewProjectLocationChannel, OpenBuildsDirectoryChannel, OpenEditorContextMenuChannel,
	OpenInExplorerChannel,
	OpenProjectChannel,
	RenameFileChannel,
	RunProjectChannel,
	SaveFileChannel,
	UpdateAppState
} from '../../shared/Channels';
import * as path from 'path';
import {formatProjectName} from '../../shared/utils';
import {execFile} from 'child_process';
import AdmZip from 'adm-zip';
import {updateEditorMenu} from '../EditorMenu';
import {buildProject} from './BuildProject';
import Store from 'electron-store';
import { format } from 'date-fns';
import { createWriteStream } from 'fs';
import archiver from 'archiver';

const localstore = new Store();

export const registerIPCHandlers = (window: BrowserWindow) => {
	const source = getIPCMainChannelSource(window);
	let state: AppState;

	OpenProjectChannel(source).handle(() => {
		const getProjectPath = async (): Promise<{ root: EditorFile, tseproj: string } | undefined> => {
			const selection = await dialog.showOpenDialog({
				title: 'Open project',
				filters: [{ name: 'tseproj', extensions: ['tseproj'] }]
			});

			if (selection.canceled) return;

			const projectPath = path.dirname(selection.filePaths[0]);

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
		try {
			const root = await fs.opendir(path);

			return getFiles(root);
		} catch {
			return;
		}
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
	});

	CreateFileChannel(source).handle(async ({ directoryPath, extension }) => {
		let index = 0;
		let filename = '';

		// eslint-disable-next-line no-constant-condition
		while (true) {
			filename = `NewFile${index > 0 ? `${index}` : ''}.${extension}`;

			try {
				// flag "wx" will write to a new file, and error out if the file already exists
				await fs.writeFile(path.join(directoryPath, filename), '', { flag: 'wx' });
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

		// eslint-disable-next-line no-constant-condition
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

	UpdateAppState(source).listen(appState => {
		state = appState;

		updateEditorMenu(window, appState);
		localstore.set('store', appState.storage);
	});

	GetLocalStoreChannel(source).handle(() => localstore.get('store', {}) as AppState["storage"]);

	const buildProjectLogChannel = BuildProjectLogChannel(source);
	const log = (message: string) => {
		buildProjectLogChannel.send(message);
	}

	BuildProjectChannel(source).handle(async data => {
		const modInfo = await buildProject(log, state, data);

		if (!modInfo) return;

		const buildsPath = path.join(data.projectPath, 'Builds');
		const cachePath = path.join(buildsPath, 'cache');

		const zipFileName = `build-${format(new Date(), "yyyy-MM-dd'T'HH-mm-ss")}.zip`;
		log(`============== Creating ${zipFileName}...`);

		const zipFilePath = path.join(data.projectPath, 'Builds', zipFileName);
		const zipFile = createWriteStream(zipFilePath);
		const zip = archiver('zip', {zlib: {level: 9}});
		zip.pipe(zipFile);
		modInfo.ModFiles.forEach(file => {
			const filePath = path.join(cachePath, file);
			zip.append(fsNormal.createReadStream(filePath), { name: file });
		});
		zip.append(JSON.stringify(modInfo, null, 2), { name: generateModInfoFilename(modInfo) });
		await zip.finalize();

		log('============== Cleaning up...');

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

		return zipFileName;
	});

	type PreviousInstall = {
		modinfo?: string
	};

	RunProjectChannel(source).handle(async ({ project, projectPath, gamePath }) => {
		const archivesPath = path.join(path.dirname(gamePath), 'Archives');
		const cachePath = path.join(projectPath, 'Builds', 'cache');

		const modInfo = await buildProject(log, state, {project, projectPath});

		if (!modInfo) return;

		let previousInstall: PreviousInstall = {};
		try {
			const previousInstallText = await fs.readFile(path.join(cachePath, 'previousinstall.json'), 'utf8');
			previousInstall = JSON.parse(previousInstallText) as PreviousInstall;
			// eslint-disable-next-line no-empty
		} catch {}

		const previousModinfoFilename = previousInstall.modinfo;
		if (previousModinfoFilename) {
			log('============== Clearing existing mod installation...');
			const previousModInfoPath = path.join(archivesPath, previousModinfoFilename);
			const previousModInfoContents = await fs.readFile(previousModInfoPath, 'utf8');
			const previousModInfo = JSON.parse(previousModInfoContents) as ModInfo;

			const tasks: Promise<unknown>[] = [];

			previousModInfo.ModFiles.forEach(file => {
				tasks.push(fs.rm(path.join(archivesPath, file), { recursive: true }).catch());
			});

			tasks.push(fs.rm(previousModInfoPath, { recursive: true }).catch());

			await Promise.all(tasks);
		}

		log(`============== Installing mod into ${archivesPath}...`);

		const tasks: Promise<unknown>[] = [];
		modInfo.ModFiles.forEach(file => {
			tasks.push(fs.cp(path.join(cachePath, file), path.join(archivesPath, file), { recursive: true }));
		});

		tasks.push(fs.writeFile(path.join(archivesPath, generateModInfoFilename(modInfo)), JSON.stringify(modInfo, null, 2)));

		await Promise.all(tasks);

		log('============== Mod installed! Launching game...');

		const game = execFile(gamePath, { cwd: path.dirname(gamePath) }, (error, stdout, stderr) => {
			log(stdout);
			log(stderr);
		});
		await new Promise(resolve => game.on('close', resolve));

		log('============== Game closed!');

		return;
	});

	OpenBuildsDirectoryChannel(source).listen(() => openBuildsDirectory(state));

	OpenEditorContextMenuChannel(source).listen(() => {
		const menu = Menu.buildFromTemplate([
			{
				role: 'cut'
			},
			{
				role: 'copy'
			},
			{
				role: 'paste'
			},
			{
				role: 'delete'
			},
			{
				role: 'selectAll'
			}
		]);

		menu.popup();
	});
};
