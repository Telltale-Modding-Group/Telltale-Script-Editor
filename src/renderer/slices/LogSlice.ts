import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface LogState {
	logs: string[]
}

const initialState: LogState = {
	logs: []
};

export const LogSlice = createSlice({
	name: 'log',
	initialState,
	reducers: {
		addLog: (state, {payload}: PayloadAction<string>) => {
			state.logs.push(payload);
		},
		clear: () => initialState
	}
});

export const LogActions = LogSlice.actions;
export const LogReducer = LogSlice.reducer;