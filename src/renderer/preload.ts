import {MainProcessUtils} from './MainProcessUtils';
import { contextBridge, ipcRenderer } from 'electron';
import {
	RunProjectChannel,
	BuildProjectChannel,
	BuildProjectLogChannel,
	ChannelSource,
	CreateDirectoryChannel,
	CreateFileChannel,
	CreateProjectDirectoryChannel,
	DeleteFileChannel,
	GetDirectoryChannel,
	GetFileContentsChannel,
	GetGamePathChannel,
	GetNewProjectLocationChannel,
	MenuBuildProjectChannel,
	MenuNewProjectChannel,
	MenuNotImplementedChannel,
	MenuOpenProjectChannel,
	MenuProjectSettingsChannel,
	OpenInExplorerChannel,
	OpenProjectChannel,
	RenameFileChannel,
	SaveFileChannel,
	UpdateAppState,
	MenuCloseProjectChannel,
	MenuBuildAndRunProjectChannel,
	MenuAboutChannel,
	MenuSettingsChannel, GetLocalStoreChannel, OpenBuildsDirectoryChannel, OpenEditorContextMenuChannel
} from '../shared/Channels';

const source: ChannelSource = {
	send: ipcRenderer.send,
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
	deleteFile: DeleteFileChannel(source).invoke,
	createDirectory: CreateDirectoryChannel(source).invoke,
	createFile: CreateFileChannel(source).invoke,
	openInExplorer: OpenInExplorerChannel(source).send,
	buildProject: BuildProjectChannel(source).invoke,
	runProject: RunProjectChannel(source).invoke,
	getGamePath: GetGamePathChannel(source).invoke,
	getLocalStore: GetLocalStoreChannel(source).invoke,
	updateAppState: UpdateAppState(source).send,
	openBuildsDirectory: OpenBuildsDirectoryChannel(source).send,
	openEditorContextMenu: OpenEditorContextMenuChannel(source).send,

	handleMenuNewProject: MenuNewProjectChannel(source).listen,
	handleMenuOpenProject: MenuOpenProjectChannel(source).listen,
	handleMenuProjectSettings: MenuProjectSettingsChannel(source).listen,
	handleMenuBuildProject: MenuBuildProjectChannel(source).listen,
	handleMenuBuildAndRunProject: MenuBuildAndRunProjectChannel(source).listen,
	handleMenuCloseProject: MenuCloseProjectChannel(source).listen,
	handleMenuAbout: MenuAboutChannel(source).listen,
	handleMenuSettings: MenuSettingsChannel(source).listen,
	handleBuildProjectLog: BuildProjectLogChannel(source).listen,

	// TODO: Remove once everything is good to go
	handleMenuNotImplemented: MenuNotImplementedChannel(source).listen
};

contextBridge.exposeInMainWorld('ipc', ipc);
