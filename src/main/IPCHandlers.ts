import {dialog, ipcMain, BrowserWindow, Menu} from 'electron';
import {opendir, readFile, writeFile} from 'fs/promises';
import path from 'path';
import {getFiles} from './utils';
import {EditorFile} from '../shared/types';
import {ChannelSource, GetFileContentsChannel, OpenProjectChannel, SaveFileChannel} from '../shared/Channels';

const getIPCMainChannelSource = (window: BrowserWindow): ChannelSource => ({
	send: window.webContents.send,
	invoke: channel => { throw new Error(`Attempted to invoke invokable channel "${channel}", but IPCMain is unable to invoke invokable channels!`) },
	handle: ipcMain.handle,
	listen: ipcMain.on
});

export const registerIPCHandlers = (window: BrowserWindow) => {
	const IPCMainSource = getIPCMainChannelSource(window);

	OpenProjectChannel(IPCMainSource).handle(async () => {
		const selection = await dialog.showOpenDialog({
			title: 'Open project',
			filters: [
				{
					name: 'Telltale Script Editor Project',
					extensions: ['tseproj']
				}
			]
		});

		if (selection.canceled) return null;

		const root = await opendir(path.dirname(selection.filePaths[0]));

		return getFiles(root);
	});

	GetFileContentsChannel(IPCMainSource).handle(async path =>
		// TODO: We should probably handle errors here, e.g. user loads up project, deletes file in explorer.exe,
		//       then attempts to click on file in filetree
		// The .trim() ensures any weird empty space characters are removed, which makes life easier
		(await readFile(path, { encoding: 'utf8' })).trim()
	);

	SaveFileChannel(IPCMainSource).handle(({ path, contents }) => {
		// TODO: Handle errors
		return writeFile(path, contents)
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