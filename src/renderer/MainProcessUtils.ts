import {EditorFile} from '../shared/types';
import {GetFileContentsChannel, OpenProjectChannel, SaveFileChannel} from '../shared/Channels';

type Unregister = () => void;

export interface MainProcessUtils {
	// TODO: I tried making a custom utility type to avoid all this duplication, but Typescript got mad. I got better
	//       things to do so I moved on, but I tried this:
	//       type ChannelResponse<T extends ReturnType<typeof createInvokableChannel>> = ReturnType<T>["invoke"];
	//       openProject: ChannelResponse<typeof OpenProjectChannel>
	//       Error: Type '(data: void) => Promise<EditorFile>' is not assignable to type '(data: unknown) => Promise<unknown>'.
	openProject: ReturnType<typeof OpenProjectChannel>["invoke"];
	getFileContents: ReturnType<typeof GetFileContentsChannel>["invoke"];
	saveFile: ReturnType<typeof SaveFileChannel>["invoke"];
	openDirectoryContextMenu: (file: EditorFile) => Promise<void>;

	registerOpenNewFileModalHandler: (handler: (path: string) => void) => Unregister;
}

// window.ipc is populated from preload.ts, which is run before any react code is active.
export const MainProcess: MainProcessUtils = (window as any).ipc;