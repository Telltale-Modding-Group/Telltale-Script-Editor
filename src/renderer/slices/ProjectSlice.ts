import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Project} from '../../shared/types';

interface ProjectState {
	currentProject?: Project,
	gameExePath?: string
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
		setGameExePath: (state, { payload }: PayloadAction<string>) => {
			state.gameExePath = payload;
		},
		clear: () => initialState
	}
});

export const ProjectActions = ProjectSlice.actions;
export const ProjectReducer = ProjectSlice.reducer;