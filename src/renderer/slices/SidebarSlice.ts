import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type SidebarTabs = 'filetree' | 'logs'

interface SidebarState {
	activeTab: SidebarTabs;
}

const initialState: SidebarState = {
	activeTab: 'filetree'
}

export const SidebarSlice = createSlice({
	name: 'sidebar',
	initialState,
	reducers: {
		setActiveTab: (state, { payload }: PayloadAction<SidebarTabs>) => {
			state.activeTab = payload;
		},
		clear: () => initialState
	}
});

export const SidebarActions = SidebarSlice.actions;
export const SidebarReducer = SidebarSlice.reducer;