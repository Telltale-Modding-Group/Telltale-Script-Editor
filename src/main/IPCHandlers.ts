import {BrowserWindow, dialog, ipcMain, Menu} from 'electron';
import * as fs from 'fs/promises';
import {getFiles, getIPCMainChannelSource} from './utils';
import {EditorFile} from '../shared/types';
import {
	CreateProjectDirectoryChannel,
	GetDirectoryChannel,
	GetFileContentsChannel,
	GetNewProjectLocationChannel,
	OpenProjectChannel, RenameFileChannel,
	SaveFileChannel
} from '../shared/Channels';
import * as path from 'path';
import {formatProjectName} from '../shared/utils';

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

	SaveFileChannel(source).handle(({ path, contents }) => {
		// TODO: Handle errors
		return fs.writeFile(path, contents)
	})

	ipcMain.handle('openmenu:directory', (ev, file: EditorFile) => {
		const directoryContextMenu = Menu.buildFromTemplate([
			{
				label: 'New',
				submenu: [
					{
						label: 'File...',
						click: () => ev.sender.send('modal:createfile:open', file.path)
					},
					{
						label: 'Directory...'
					}
				]
			},
			{
				label: 'Rename...'
			},
			{
				label: 'Delete'
			}
		]);

		directoryContextMenu.popup();
	});
};
