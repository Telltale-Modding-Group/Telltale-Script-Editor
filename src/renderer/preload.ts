import {MainProcessUtils} from './MainProcessUtils';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {ChannelSource, GetFileContentsChannel, OpenProjectChannel, SaveFileChannel} from '../shared/Channels';

const IPCRendererChannelSource: ChannelSource = {
	send: ipcRenderer.send,
	invoke: ipcRenderer.invoke,
	handle: channel => { throw new Error(`Attempted to listen to invokable channel "${channel}", but IPCRenderer is unable to listen to invokable channels!`) },
	listen: ipcRenderer.on
};

const ipc: MainProcessUtils = {
	openProject: OpenProjectChannel(IPCRendererChannelSource).invoke,
	getFileContents: GetFileContentsChannel(IPCRendererChannelSource).invoke,
	saveFile: SaveFileChannel(IPCRendererChannelSource).invoke,
	openDirectoryContextMenu: file => ipcRenderer.invoke('openmenu:directory', file),

	registerOpenNewFileModalHandler: handler => {
		const listener = (event: IpcRendererEvent, path: string) => handler(path);
		ipcRenderer.on('modal:createfile:open', listener);

		return () => ipcRenderer.removeListener('modal:createfile:open', listener);
	}
};

contextBridge.exposeInMainWorld('ipc', ipc);