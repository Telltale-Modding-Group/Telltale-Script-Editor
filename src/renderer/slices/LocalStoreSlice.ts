import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface LocalStoreState {
	gamePath?: string
}

const initialState: LocalStoreState = {};

export const LocalStoreSlice = createSlice({
	name: 'localstore',
	initialState,
	reducers: {
		setGamePath: (state, { payload }: PayloadAction<string | undefined>) => {
			state.gamePath = payload
		}
	}
});

export const LocalStoreActions = LocalStoreSlice.actions;
export const LocalStoreReducer = LocalStoreSlice.reducer;