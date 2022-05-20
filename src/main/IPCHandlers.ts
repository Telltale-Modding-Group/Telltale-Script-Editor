import {dialog, ipcMain, BrowserWindow, Menu} from 'electron';
import * as fs from 'fs/promises';
import { constants } from 'fs';
import {getFiles} from './utils';
import {EditorFile} from '../shared/types';
import {
	ChannelSource,
	GetDirectoryChannel,
	GetFileContentsChannel,
	OpenProjectChannel,
	SaveFileChannel
} from '../shared/Channels';

const getIPCMainChannelSource = (window: BrowserWindow): ChannelSource => ({
	send: window.webContents.send,
	invoke: channel => { throw new Error(`Attempted to invoke invokable channel "${channel}", but IPCMain is unable to invoke invokable channels!`) },
	handle: ipcMain.handle,
	listen: ipcMain.on
});

export const registerIPCHandlers = (window: BrowserWindow) => {
	const IPCMainSource = getIPCMainChannelSource(window);

	OpenProjectChannel(IPCMainSource).handle(async () => {
		const getProjectPath = async (): Promise<string | undefined> => {
			const selection = await dialog.showOpenDialog({
				title: 'Open project directory',
				properties: [
					'openDirectory'
				]
			});

			if (selection.canceled) return;

			const projectPath = selection.filePaths[0];

			try {
				await fs.access(projectPath, constants.W_OK);
			} catch {
				await dialog.showMessageBox({
					title: 'Open project directory',
					type: 'warning',
					message: 'Invalid directory chosen, no .tseproj file found!'
				});

				return getProjectPath();
			}

			return projectPath;
		};

		return await getProjectPath();
	});

	GetDirectoryChannel(IPCMainSource).handle(async path => {
		const root = await fs.opendir(path);

		return getFiles(root)
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
