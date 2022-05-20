import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Project} from '../../shared/types';

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
		}
	}
});

export const ProjectActions = ProjectSlice.actions;
export const ProjectReducer = ProjectSlice.reducer;