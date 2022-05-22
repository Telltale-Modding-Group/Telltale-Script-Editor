import {
	RunProjectChannel,
	BuildProjectChannel, BuildProjectLogChannel,
	CreateDirectoryChannel, CreateFileChannel,
	CreateProjectDirectoryChannel, DeleteFileChannel,
	GetDirectoryChannel,
	GetFileContentsChannel, GetGamePathChannel,
	GetNewProjectLocationChannel, MenuBuildProjectChannel,
	MenuNewProjectChannel, MenuNotImplementedChannel,
	MenuOpenProjectChannel,
	MenuProjectSettingsChannel, OpenInExplorerChannel,
	OpenProjectChannel, RenameFileChannel,
	SaveFileChannel, UpdateAppState, MenuCloseProjectChannel, MenuBuildAndRunProjectChannel
} from '../shared/Channels';

export interface MainProcessUtils {
	// TODO: I tried making a custom utility type to avoid all this duplication, but Typescript got mad. I got better
	//       things to do so I moved on, but I tried this:
	//       type ChannelResponse<T extends ReturnType<typeof createInvokableChannel>> = ReturnType<T>["invoke"];
	//       openProject: ChannelResponse<typeof OpenProjectChannel>
	//       Error: Type '(data: void) => Promise<EditorFile>' is not assignable to type '(data: unknown) => Promise<unknown>'.
	openProject: ReturnType<typeof OpenProjectChannel>["invoke"];
	getNewProjectLocation: ReturnType<typeof GetNewProjectLocationChannel>["invoke"];
	getDirectory: ReturnType<typeof GetDirectoryChannel>["invoke"];
	getFileContents: ReturnType<typeof GetFileContentsChannel>["invoke"];
	createProjectDirectory: ReturnType<typeof CreateProjectDirectoryChannel>["invoke"];
	saveFile: ReturnType<typeof SaveFileChannel>["invoke"];
	renameFile: ReturnType<typeof RenameFileChannel>["invoke"];
	deleteFile: ReturnType<typeof DeleteFileChannel>["invoke"];
	createDirectory: ReturnType<typeof CreateDirectoryChannel>["invoke"];
	createFile: ReturnType<typeof CreateFileChannel>["invoke"];
	openInExplorer: ReturnType<typeof OpenInExplorerChannel>["send"];
	buildProject: ReturnType<typeof BuildProjectChannel>["invoke"];
	runProject: ReturnType<typeof RunProjectChannel>["invoke"];
	getGamePath: ReturnType<typeof GetGamePathChannel>["invoke"];
	updateAppState: ReturnType<typeof UpdateAppState>["send"];

	handleMenuNewProject: ReturnType<typeof MenuNewProjectChannel>["listen"];
	handleMenuOpenProject: ReturnType<typeof MenuOpenProjectChannel>["listen"];
	handleMenuProjectSettings: ReturnType<typeof MenuProjectSettingsChannel>["listen"];
	handleMenuBuildProject: ReturnType<typeof MenuBuildProjectChannel>["listen"];
	handleMenuCloseProject: ReturnType<typeof MenuCloseProjectChannel>["listen"];
	handleMenuBuildAndRunProject: ReturnType<typeof MenuBuildAndRunProjectChannel>["listen"];
	handleBuildProjectLog: ReturnType<typeof BuildProjectLogChannel>["listen"];

	// TODO: Remove once everything is good to go
	handleMenuNotImplemented: ReturnType<typeof MenuNotImplementedChannel>["listen"];
}

// window.ipc is populated from preload.ts, which is run before any react code is active.
// eslint-disable-next-line
export const MainProcess: MainProcessUtils = (window as any).ipc;
