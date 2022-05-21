import {MainProcessUtils} from './MainProcessUtils';
import { contextBridge, ipcRenderer } from 'electron';
import {
	ChannelSource, CreateProjectDirectoryChannel,
	GetDirectoryChannel,
	GetFileContentsChannel,
	GetNewProjectLocationChannel,
	MenuNewProjectChannel, MenuNotImplementedChannel,
	MenuOpenProjectChannel,
	MenuProjectSettingsChannel,
	OpenProjectChannel, RenameFileChannel,
	SaveFileChannel
} from '../shared/Channels';

const source: ChannelSource = {
	send: (channel, data) => ipcRenderer.sendToHost(channel, data),
	invoke: ipcRenderer.invoke,
	handle: channel => { throw new Error(`Attempted to listen to invokable channel "${channel}", but IPCRenderer is unable to listen to invokable channels!`) },
	listen: (channel, handler) => {
		ipcRenderer.on(channel, handler);

		return () => ipcRenderer.removeListener(channel, handler);
	}
};

const ipc: MainProcessUtils = {
	openProject: OpenProjectChannel(source).invoke,
	getNewProjectLocation: GetNewProjectLocationChannel(source).invoke,
	getDirectory: GetDirectoryChannel(source).invoke,
	getFileContents: GetFileContentsChannel(source).invoke,
	createProjectDirectory: CreateProjectDirectoryChannel(source).invoke,
	saveFile: SaveFileChannel(source).invoke,
	renameFile: RenameFileChannel(source).invoke,

	handleMenuNewProject: MenuNewProjectChannel(source).listen,
	handleMenuOpenProject: MenuOpenProjectChannel(source).listen,
	handleMenuProjectSettings: MenuProjectSettingsChannel(source).listen,

	// TODO: Remove once everything is good to go
	handleMenuNotImplemented: MenuNotImplementedChannel(source).listen
};

contextBridge.exposeInMainWorld('ipc', ipc);
