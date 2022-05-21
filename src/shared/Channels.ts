import {EditorFile, Project} from './types';

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

export const createChannel = <T>(channel: string) => (source: ChannelSource): Channel<T> => ({
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

export const MenuNewProjectChannel = createChannel<void>('menu:newproject');
export const MenuOpenProjectChannel = createChannel<void>('menu:openproject');
export const MenuProjectSettingsChannel = createChannel<void>('menu:projectsettings');
export const MenuNotImplementedChannel = createChannel<void>('menu:notimplemented');
