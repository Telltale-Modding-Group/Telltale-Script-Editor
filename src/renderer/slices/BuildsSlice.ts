import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {useEffect} from 'react';
import {MainProcess} from '../MainProcessUtils';
import {useAppDispatch} from './store';

interface BuildsState {
	logs: string[]
}

const initialState: BuildsState = {
	logs: []
};

export const BuildsSlice = createSlice({
	name: 'builds',
	initialState,
	reducers: {
		addLog: (state, {payload}: PayloadAction<string>) => {
			state.logs.push(payload);
		},
		clearLogs: state => {
			state.logs = []
		},
		clear: () => initialState
	}
});

export const BuildsActions = BuildsSlice.actions;
export const BuildsReducer = BuildsSlice.reducer;

export const useBuildsSideEffects = () => {
	const dispatch = useAppDispatch();

	useEffect(() =>
		MainProcess.handleBuildProjectLog(log => dispatch(BuildsActions.addLog(log))),
	[]
	);
};