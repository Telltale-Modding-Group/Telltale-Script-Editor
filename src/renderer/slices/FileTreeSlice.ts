import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { AppState, EditorFile } from '../../shared/types';
import {MainProcess} from '../MainProcessUtils';

interface FileTreeState {
	selectedFile?: EditorFile,
	root?: EditorFile,
	// The file currently being renamed
	renamingFilePath?: string,
	expandedDirectories: Record<string, true>;
	contextMenuAnchorPoint: {
		x: number,
		y: number
	},
	showContextMenu: boolean
}

const initialState: FileTreeState = {
	expandedDirectories: {},
	contextMenuAnchorPoint: { x: 0, y: 0 },
	showContextMenu: false
};

const setRootDirectoryFromPath = createAsyncThunk('filetree/setrootdirectoryfrompath', (path: string) =>
	MainProcess.getDirectory(path)
);

const refreshRootDirectory = createAsyncThunk('filetree/refreshrootdirectory', (_, api) =>
	// eslint-disable-next-line
	MainProcess.getDirectory((api.getState() as AppState).filetree.root!.path)
);

export const FileTreeSlice = createSlice({
	name: 'filetree',
	initialState,
	reducers: {
		setSelectedFile: (state, { payload }: PayloadAction<EditorFile>) => {
			state.selectedFile = payload;
		},
		setRootDirectory: (state, { payload }: PayloadAction<EditorFile | undefined>) => {
			state.root = payload;
		},
		setRenamingFilePath: (state, { payload }: PayloadAction<string | undefined>) => {
			state.renamingFilePath = payload;
		},
		expandDirectory: (state, { payload }: PayloadAction<string>) => {
			state.expandedDirectories[payload] = true;
		},
		collapseDirectory: (state, { payload }: PayloadAction<string>) => {
			delete state.expandedDirectories[payload];
		},
		toggleDirectory: (state, { payload }: PayloadAction<string>) => {
			if (state.expandedDirectories[payload]) {
				delete state.expandedDirectories[payload];
			} else {
				state.expandedDirectories[payload] = true;
			}
		},
		setContextMenuAnchorPoint: (state, { payload }: PayloadAction<{ x: number, y: number }>) => {
			state.contextMenuAnchorPoint = payload;
		},
		setShowContextMenu: (state, { payload }: PayloadAction<boolean>) => {
			state.showContextMenu = payload;
		},
		clear: () => initialState
	},
	extraReducers: builder => {
		builder
			.addCase(setRootDirectoryFromPath.fulfilled, (state, { payload }) => {
				state.root = payload;
			})
			.addCase(refreshRootDirectory.fulfilled, (state, { payload }) => {
				state.root = payload;
			});
	}
})

export const FileTreeActions = FileTreeSlice.actions;
export const FileTreeAsyncActions = { setRootDirectoryFromPath, refreshRootDirectory };

export const FileTreeReducer = FileTreeSlice.reducer;
