import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {useEffect, useState} from 'react';
import {MainProcess} from '../MainProcessUtils';
import {useAppDispatch, useAppSelector} from './store';

interface StorageState {
	gamePath?: string,
	sidebarWidth: number
}

const initialState: StorageState = {
	sidebarWidth: 250
};

// NOTE: This is automatically synchronised with a config file on disk to persist data between application restarts.
export const StorageSlice = createSlice({
	name: 'storage',
	initialState,
	reducers: {
		setGamePath: (state, {payload}: PayloadAction<string | undefined>) => {
			state.gamePath = payload
		},
		setSidebarWidth: (state, {payload}: PayloadAction<number>) => {
			state.sidebarWidth = Math.round(Math.max(payload, initialState.sidebarWidth));
		},
		setStorageState: (state, {payload}: PayloadAction<StorageState>) => payload
	}
});

export const StorageActions = StorageSlice.actions;
export const StorageReducer = StorageSlice.reducer;

export const useStorageStateSync = () => {
	const dispatch = useAppDispatch();
	const state = useAppSelector(state => state);
	const [initialised, setInitialised] = useState(false);

	useEffect(() => {
		(async () => {
			if (!initialised) {
				const storage = await MainProcess.getLocalStore();

				dispatch(StorageActions.setStorageState(storage));

				setInitialised(true);
			} else {
				MainProcess.updateAppState(state);
			}
		})();
	}, [initialised, state]);
}