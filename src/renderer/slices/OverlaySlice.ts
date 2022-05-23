import {createSlice} from '@reduxjs/toolkit';

interface OverlayState {
	visible: boolean
}

const initialState: OverlayState = {
	visible: false
};

export const OverlaySlice = createSlice({
	name: 'overlay',
	initialState,
	reducers: {
		show: state => {
			state.visible = true;
		},
		hide: state => {
			state.visible = false;
		}
	}
});

export const OverlayActions = OverlaySlice.actions;
export const OverlayReducer = OverlaySlice.reducer;