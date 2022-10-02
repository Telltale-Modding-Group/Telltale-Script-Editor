import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {useEffect, useState} from 'react';
import {MainProcess} from '../MainProcessUtils';
import {useAppDispatch, useAppSelector} from './store';
import {RecentProject} from '../types';
import {createDebouncer} from '../utils';

interface StorageState {
	initialised: boolean,
	gamePath?: string,
	sidebarWidth: number,
	recentProjects: RecentProject[],
	maximumBuildsToKeep: number,
	saveFilesOnBuild: boolean
}

const initialState: StorageState = {
	initialised: false,
	sidebarWidth: 250,
	recentProjects: [],
	maximumBuildsToKeep: 5,
	saveFilesOnBuild: true
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
		addRecentProject: (state, {payload}: PayloadAction<RecentProject>) => {
			state.recentProjects = [payload, ...state.recentProjects.filter(recentProject => recentProject.tseprojPath !== payload.tseprojPath)];
		},
		removeRecentProject: (state, {payload}: PayloadAction<RecentProject>) => {
			state.recentProjects = state.recentProjects.filter(({ tseprojPath }) => tseprojPath !== payload.tseprojPath);
		},
		setMaximumBuildsToKeep: (state, {payload}: PayloadAction<number>) => {
			state.maximumBuildsToKeep = payload >= 0 ? payload : 0
		},
		setSaveFilesOnBuild: (state, {payload}: PayloadAction<boolean>) => {
			state.saveFilesOnBuild = payload
		},
		setStorageState: (state, {payload}: PayloadAction<StorageState>) => payload
	}
});

export const StorageActions = StorageSlice.actions;
export const StorageReducer = StorageSlice.reducer;

const debounce = createDebouncer();
// TODO: This can probably live next to the root store rather than needing hooks
export const useStorageStateSync = () => {
	const dispatch = useAppDispatch();
	const state = useAppSelector(state => state);
	const [initialised, setInitialised] = useState(false);

	useEffect(() => {
		(async () => {
			if (!initialised) {
				const storage = await MainProcess.getLocalStore();

				dispatch(StorageActions.setStorageState({ ...initialState, ...storage, initialised: true }));

				setInitialised(true);
			} else {
				debounce(() => MainProcess.updateAppState(state), 500);
			}
		})();
	}, [initialised, state]);
}