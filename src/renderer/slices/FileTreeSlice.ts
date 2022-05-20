import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorFile } from '../../shared/types';
import { MainProcess } from '../MainProcessUtils';

interface FileTreeState {
	selectedPath?: string,
	root?: EditorFile
}

const initialState: FileTreeState = {};

const setRootDirectory = createAsyncThunk('filetree/setrootdirectory', (path: string) => {
	return MainProcess.getDirectory(path);
});

export const FileTreeSlice = createSlice({
	name: 'filetree',
	initialState,
	reducers: {
		setSelectedPath: (state, { payload }: PayloadAction<string | undefined>) => {
			state.selectedPath = payload;
		}
	},
	extraReducers: builder => {
		builder
			.addCase(setRootDirectory.fulfilled, (state, { payload }) => {
				state.root = payload;
			});
	}
})

export const FileTreeActions = FileTreeSlice.actions;
export const FileTreeAsyncActions = { setRootDirectory };

export const FileTreeReducer = FileTreeSlice.reducer;
