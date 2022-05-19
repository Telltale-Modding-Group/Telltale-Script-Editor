import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface FileTreeState {
	selectedPath?: string
}

const initialState: FileTreeState = {};

export const FileTreeSlice = createSlice({
	name: 'filetree',
	initialState,
	reducers: {
		setSelectedPath: (state, { payload }: PayloadAction<string | undefined>) => {
			state.selectedPath = payload;
		}
	}
})

export const FileTreeActions = FileTreeSlice.actions;
export const FileTreeReducer = FileTreeSlice.reducer;