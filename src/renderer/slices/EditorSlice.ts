import {OpenFile} from '../types';
import {createAsyncThunk, createSlice, Draft, PayloadAction} from '@reduxjs/toolkit';
import { AppState, EditorFile } from '../../shared/types';
import {MainProcess} from '../MainProcessUtils';

interface EditorState {
	openFiles: OpenFile[],
	activeFileIndex?: number
}

const initialState: EditorState = {
	openFiles: []
};

const openFile = createAsyncThunk('editor/openfile', async (file: EditorFile) => {
	return { file, contents: await MainProcess.getFileContents(file.path) };
});

const saveFile = createAsyncThunk('editor/savefile', async (index: number, api) => {
	const state = api.getState() as AppState;
	const file = state.editor.openFiles[index];

	await MainProcess.saveFile({ path: file.file.path, contents: file.contents });

	return index;
});

const saveAllFiles = createAsyncThunk('editor/saveallfiles', async (_, api) => {
	const state = api.getState() as AppState;

	for (const file of state.editor.openFiles) {
		await MainProcess.saveFile({ path: file.file.path, contents: file.contents });
	}

	return;
});

const saveFileAndClose = createAsyncThunk('editor/savefileandclose', async (index: number, api) => {
	const state = api.getState() as AppState;
	const file = state.editor.openFiles[index];

	await MainProcess.saveFile({ path: file.file.path, contents: file.contents });

	return index;
});

const closeFileReducer = (state: Draft<EditorState>, { payload: indexToClose }: PayloadAction<number>) => {
	if (state.activeFileIndex === undefined) return;

	// Returns a new array without the element at position 'index'.
	// Might be a better way of doing things, but this works well enough...
	state.openFiles = state.openFiles.filter((_, i) => i !== indexToClose);

	if (indexToClose < state.activeFileIndex) {
		state.activeFileIndex--;
	}

	if (state.activeFileIndex === indexToClose) {
		let newIndex = indexToClose;
		if (newIndex >= state.openFiles.length) newIndex--;

		state.activeFileIndex = newIndex >= 0 ? newIndex : undefined;
	}
};

export const EditorSlice = createSlice({
	name: 'editor',
	initialState,
	reducers: {
		closeFile: closeFileReducer,
		setActiveFileIndex: (state, { payload }: PayloadAction<number | undefined>) => {
			state.activeFileIndex = payload;
		},
		setActiveFileContents: (state, { payload: newContents }: PayloadAction<string>) => {
			if (state.activeFileIndex === undefined) return;

			const openFile = state.openFiles[state.activeFileIndex];

			if (openFile.contents === newContents) return;

			openFile.contents = newContents;
			openFile.hasUnsavedChanges = true;
		},
		handleRename: (state, { payload: { oldPath, newPath } }: PayloadAction<{ oldPath: string, newPath: string }>) => {
			state.openFiles.forEach(openFile => {
				openFile.file.path = openFile.file.path.replace(oldPath, newPath)
			});
		},
		handleFileDeleted: (state, { payload }: PayloadAction<EditorFile>) => {
			state.openFiles.forEach((openFile, index) => {
				if (!openFile.file.path.includes(payload.path)) return;

				closeFileReducer(state, { payload: index, type: '' });
			});
		},
		clear: () => initialState
	},
	extraReducers: builder => {
		builder
			.addCase(openFile.fulfilled, (state, { payload: { file, contents } }) => {
				const path = file.path;

				if (!state.openFiles.some(({file}) => file.path === path)) {
					state.openFiles.push({ file, contents, hasUnsavedChanges: false });
				}

				state.activeFileIndex = state.openFiles.findIndex(({ file }) => file.path === path);
			})
			.addCase(saveFile.fulfilled, (state, { payload: index }) => {
				state.openFiles[index].hasUnsavedChanges = false;
			})
			.addCase(saveAllFiles.fulfilled, (state) => {
				for (const file of state.openFiles) {
					file.hasUnsavedChanges = false;
				}
			})
			.addCase(saveFileAndClose.fulfilled, (state, action) => {
				closeFileReducer(state, action);
			})
	}
});

export const EditorReducer = EditorSlice.reducer;
export const EditorActions = EditorSlice.actions;
export const EditorAsyncActions = { openFile, saveFile, saveAllFiles, saveFileAndClose };
