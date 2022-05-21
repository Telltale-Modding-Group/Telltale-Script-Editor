import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { EditorFile } from '../../shared/types';
import {MainProcess} from '../MainProcessUtils';
import {RootState} from './store';

interface FileTreeState {
	selectedPath?: string,
	root?: EditorFile
}

const initialState: FileTreeState = {};

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
