import {BrowserWindow, dialog, ipcMain, Menu} from 'electron';
import * as fs from 'fs/promises';
import {getFiles, getIPCMainChannelSource} from './utils';
import {EditorFile} from '../shared/types';
import {GetDirectoryChannel, GetFileContentsChannel, OpenProjectChannel, SaveFileChannel} from '../shared/Channels';
import * as path from 'path';

export const registerIPCHandlers = (window: BrowserWindow) => {
	const IPCMainSource = getIPCMainChannelSource(window);

	OpenProjectChannel(IPCMainSource).handle(() => {
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

	GetDirectoryChannel(IPCMainSource).handle(async path => {
		const root = await fs.opendir(path);

		return getFiles(root);
	});

	GetFileContentsChannel(IPCMainSource).handle(async path =>
		// TODO: We should probably handle errors here, e.g. user loads up project, deletes file in explorer.exe,
		//       then attempts to click on file in filetree
		// The .trim() ensures any weird empty space characters are removed, which makes life easier
		(await fs.readFile(path, { encoding: 'utf8' })).trim()
	);

	SaveFileChannel(IPCMainSource).handle(({ path, contents }) => {
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
