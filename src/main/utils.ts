import {Dir} from 'fs';
import {EditorFile} from '../shared/types';
import path from 'path';
import {opendir} from 'fs/promises';
import {BrowserWindow, ipcMain} from 'electron';
import {ChannelSource} from '../shared/Channels';

export type FileData = { directory: boolean, name: string, path: string };
export const getFilesInDirectory = async (root: Dir): Promise<Array<FileData>> => {
	const dirents: Array<FileData> = [];

	for await (const dirent of root) {
		const direntPath = path.join(root.path, dirent.name);

		if (dirent.isFile()) {
			dirents.push({
				directory: false,
				name: dirent.name,
				path: direntPath
			});
		} else {
			dirents.push({
				directory: true,
				name: dirent.name,
				path: direntPath
			});

			dirents.push(...await getFilesInDirectory(await opendir(direntPath)));
		}
	}

	return dirents;
};

export const getFiles = async (root: Dir): Promise<EditorFile> => {
	const children: Array<EditorFile> = [];

	for await (const dirent of root) {
		if (dirent.isFile()) {
			children.push({
				directory: false,
				name: dirent.name,
				path: path.join(root.path, dirent.name)
			});
		} else {
			children.push(await getFiles(await opendir(path.join(root.path, dirent.name))));
		}
	}

	return {
		directory: true,
		name: path.basename(root.path),
		path: root.path,
		children
	};
};

export const getIPCMainChannelSource = (window: BrowserWindow): ChannelSource => ({
	send: (channel, data) => window.webContents.send(channel, data),
	invoke: channel => {
		throw new Error(`Attempted to invoke invokable channel "${channel}", but IPCMain is unable to invoke invokable channels!`)
	},
	handle: (channel, handler) => {
		ipcMain.handle(channel, handler);

		return () => ipcMain.removeListener(channel, handler);
	},
	listen: (channel, handler) => {
		ipcMain.on(channel, handler);

		return () => ipcMain.removeListener(channel, handler);
	}
});