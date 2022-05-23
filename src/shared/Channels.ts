import {AppState, EditorFile, Project} from './types';

type RemoveListener = () => void;

type Channel<T> = {
	send: (data: T) => void,
	listen: (handler: (data: T) => void) => RemoveListener;
}

type InvokableChannel<T,R> = {
	invoke: (data: T) => Promise<R>,
	handle: (handler: (data: T) => R | Promise<R>) => RemoveListener;
};

export type ChannelSource = {
	send: (channel: string, data: unknown) => void,
	invoke: (channel: string, data: unknown) => Promise<unknown>,
	listen: (channel: string, handler: (event: unknown, data: unknown) => void) => RemoveListener,
	handle: (channel: string, handler: (event: unknown, data: unknown) => unknown) => RemoveListener
}

export const createChannel = <T = void>(channel: string) => (source: ChannelSource): Channel<T> => ({
	send: data => source.send(channel, data),
	listen: handler => source.listen(channel, (event, data) => handler(data as T))
});

export const createInvokableChannel = <T,R>(channel: string) => (source: ChannelSource): InvokableChannel<T,R> => ({
	invoke: data => source.invoke(channel, data) as Promise<R>,
	handle: handler => source.handle(channel, (event, data) => handler(data as T))
});

export const OpenProjectChannel = createInvokableChannel<void, { root: EditorFile, tseproj: string } | undefined>('openproject');
export const GetNewProjectLocationChannel = createInvokableChannel<void, string | undefined>('getnewprojectlocation');
export const CreateProjectDirectoryChannel = createInvokableChannel<{ projectPath: string, project: Project }, { root: EditorFile }>('createprojectdirectory');
export const GetDirectoryChannel = createInvokableChannel<string, EditorFile | undefined>('getdirectory');
export const GetFileContentsChannel = createInvokableChannel<string, string>('getfilecontents');
export const SaveFileChannel = createInvokableChannel<{ path: string, contents: string }, void>('savefile');
export const RenameFileChannel = createInvokableChannel<{ file: EditorFile, newName: string }, string>('renamefile');
export const DeleteFileChannel = createInvokableChannel<EditorFile, void>('deletefile');
export const CreateFileChannel = createInvokableChannel<{ directoryPath: string, extension: string }, string>('createfile');
export const CreateDirectoryChannel = createInvokableChannel<string, string>('createdirectory');
export const BuildProjectChannel = createInvokableChannel<{ projectPath: string, project: Project }, string | undefined>('buildproject');
export const GetGamePathChannel = createInvokableChannel<void, string | undefined>('getgamepath');
export const GetLocalStoreChannel = createInvokableChannel<void, AppState["storage"]>('getlocalstore');
export const RunProjectChannel = createInvokableChannel<{ buildZipPath: string, gamePath: string }, void>('runproject');

export const OpenInExplorerChannel = createChannel<string>('openinexplorer');
export const MenuNewProjectChannel = createChannel('menu:newproject');
export const MenuOpenProjectChannel = createChannel('menu:openproject');
export const MenuProjectSettingsChannel = createChannel('menu:projectsettings');
export const MenuBuildProjectChannel = createChannel('menu:buildproject');
export const MenuBuildAndRunProjectChannel = createChannel('menu:projectandrunproject');
export const MenuCloseProjectChannel = createChannel('menu:closeproject');
export const MenuAboutChannel = createChannel('menu:about');
export const MenuSettingsChannel = createChannel('menu:settings');
export const MenuNotImplementedChannel = createChannel('menu:notimplemented');
export const BuildProjectLogChannel = createChannel<string>('buildproject:log');
export const UpdateAppState = createChannel<AppState>('updateappstate');
export const OpenBuildsDirectoryChannel = createChannel('openbuildsdirectory');