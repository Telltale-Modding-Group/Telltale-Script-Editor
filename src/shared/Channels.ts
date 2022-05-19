import {EditorFile} from './types';

type Channel<T> = {
	send: (data: T) => void,
	listen: (handler: (data: T) => void) => void
}

type InvokableChannel<T,R> = {
	invoke: (data: T) => Promise<R>,
	handle: (handler: (data: T) => R | Promise<R>) => void
};

export type ChannelSource = {
	send: (channel: string, data: unknown) => void,
	invoke: (channel: string, data: unknown) => Promise<unknown>,
	listen: (channel: string, handler: (event: unknown, data: unknown) => void) => void,
	handle: (channel: string, handler: (event: unknown, data: unknown) => unknown) => void
}

export const createChannel = <T>(channel: string) => (source: ChannelSource): Channel<T> => ({
	send: data => source.send(channel, data),
	listen: handler => source.listen(channel, (event, data) => handler(data as T))
});

export const createInvokableChannel = <T,R>(channel: string) => (source: ChannelSource): InvokableChannel<T,R> => ({
	invoke: data => source.invoke(channel, data) as Promise<R>,
	handle: handler => source.handle(channel, (event, data) => handler(data as T))
});

export const OpenProjectChannel = createInvokableChannel<void, EditorFile | null>('openproject');
export const GetFileContentsChannel = createInvokableChannel<string, string>('getfilecontents');
export const SaveFileChannel = createInvokableChannel<{ path: string, contents: string }, void>('savefile');