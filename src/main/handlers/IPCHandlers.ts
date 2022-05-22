import {BrowserWindow, dialog, shell} from 'electron';
import * as fs from 'fs/promises';
import {getFiles, getIPCMainChannelSource} from '../utils';
import {EditorFile, LocalStore} from '../../shared/types';
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
	GetNewProjectLocationChannel,
	OpenInExplorerChannel,
	OpenProjectChannel,
	RenameFileChannel,
	RunProjectChannel,
	SaveFileChannel,
	UpdateAppState, UpdateLocalStoreChannel
} from '../../shared/Channels';
import * as path from 'path';
import {formatProjectName} from '../../shared/utils';
import {execFile} from 'child_process';
import AdmZip from 'adm-zip';
import {updateEditorMenu} from '../EditorMenu';
import {buildProject} from './BuildProject';
import Store from 'electron-store';

const localstore = new Store();

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

	GetLocalStoreChannel(source).handle(() => localstore.get('store', {}) as LocalStore);

	UpdateLocalStoreChannel(source).listen(data => localstore.set('store', data));

	CreateFileChannel(source).handle(async ({ directoryPath, extension }) => {
		let index = 0;
		let filename = '';

		// eslint-disable-next-line no-constant-condition
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

	UpdateAppState(source).listen(state => updateEditorMenu(window, state));

	const buildProjectLogChannel = BuildProjectLogChannel(source);
	const log = (message: string) => {
		buildProjectLogChannel.send(message);
	}

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
