import {MainProcessUtils} from './MainProcessUtils';
import { contextBridge, ipcRenderer } from 'electron';
import {
	ChannelSource, GetDirectoryChannel,
	GetFileContentsChannel,
	OpenProjectChannel,
	SaveFileChannel
} from '../shared/Channels';

const IPCRendererChannelSource: ChannelSource = {
	send: ipcRenderer.send,
	invoke: ipcRenderer.invoke,
	handle: channel => { throw new Error(`Attempted to listen to invokable channel "${channel}", but IPCRenderer is unable to listen to invokable channels!`) },
	listen: ipcRenderer.on
};

const ipc: MainProcessUtils = {
	openProject: OpenProjectChannel(IPCRendererChannelSource).invoke,
	getDirectory: GetDirectoryChannel(IPCRendererChannelSource).invoke,
	getFileContents: GetFileContentsChannel(IPCRendererChannelSource).invoke,
	saveFile: SaveFileChannel(IPCRendererChannelSource).invoke,
};

contextBridge.exposeInMainWorld('ipc', ipc);
