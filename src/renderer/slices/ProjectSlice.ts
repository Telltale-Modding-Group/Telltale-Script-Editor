import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Project} from '../../shared/types';
import {useEffect} from 'react';
import {MainProcess} from '../MainProcessUtils';
import {resetAllSlices} from './store';
import {useDispatch} from 'react-redux';

interface ProjectState {
	currentProject?: Project
}

const initialState: ProjectState = {};

export const ProjectSlice = createSlice({
	name: 'project',
	initialState,
	reducers: {
		setProject: (state, { payload }: PayloadAction<Project>) => {
			state.currentProject = payload;
		},
		setModName: (state, { payload: name }: PayloadAction<string>) => {
			if (!state.currentProject) return;

			state.currentProject.mod.name = name;
		},
		setModVersion: (state, { payload: version }: PayloadAction<string>) => {
			if (!state.currentProject) return;

			state.currentProject.mod.version = version;
		},
		setModAuthor: (state, { payload: author }: PayloadAction<string>) => {
			if (!state.currentProject) return;

			state.currentProject.mod.author = author;
		},
		setModPriority: (state, { payload: priority }: PayloadAction<number>) => {
			if (!state.currentProject) return;

			state.currentProject.mod.priority = priority;
		},
		setLegacyBuild: (state, { payload }: PayloadAction<boolean>) => {
			if (!state.currentProject) return;

			state.currentProject.tool.legacyBuild = payload;
		},
		setFormatVersion: (state, { payload }: PayloadAction<string>) => {
			if (!state.currentProject) return;

			state.currentProject.formatVersion = payload;
		},
		clear: () => initialState
	}
});

export const ProjectActions = ProjectSlice.actions;
export const ProjectReducer = ProjectSlice.reducer;

export const useProjectSideEffects = () => {
	const dispatch = useDispatch();

	useEffect(() =>
		MainProcess.handleMenuCloseProject(() => {
			resetAllSlices(dispatch);
		}),
	[dispatch]
	);
};