import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { EditorFile } from '../../shared/types';
import {MainProcess} from '../MainProcessUtils';
import {RootState} from './store';

interface FileTreeState {
	selectedPath?: string,
	root?: EditorFile,
	// Represents the path of a newly created file. After the file is renamed, this should be set to undefined
	newFilePath?: string,
	expandedDirectories: Record<string, true>;
}

const initialState: FileTreeState = {
	expandedDirectories: {}
};

const setRootDirectoryFromPath = createAsyncThunk('filetree/setrootdirectoryfrompath', (path: string) =>
	MainProcess.getDirectory(path)
);

const refreshRootDirectory = createAsyncThunk('filetree/refreshrootdirectory', (_, api) =>
	MainProcess.getDirectory((api.getState() as RootState).filetree.root!.path)
);

export const FileTreeSlice = createSlice({
	name: 'filetree',
	initialState,
	reducers: {
		setSelectedPath: (state, { payload }: PayloadAction<string | undefined>) => {
			state.selectedPath = payload;
		},
		setRootDirectory: (state, { payload }: PayloadAction<EditorFile | undefined>) => {
			state.root = payload;
		},
		setNewFilePath: (state, { payload }: PayloadAction<string | undefined>) => {
			state.newFilePath = payload;
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
