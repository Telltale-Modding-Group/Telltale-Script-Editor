import { configureStore } from '@reduxjs/toolkit';
import { FileTreeActions, FileTreeReducer } from './FileTreeSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { EditorActions, EditorReducer } from './EditorSlice';
import { ProjectActions, ProjectReducer } from './ProjectSlice';
import { BuildsActions, BuildsReducer } from './BuildsSlice';
import { SidebarActions, SidebarReducer } from './SidebarSlice';
import { StorageReducer } from './StorageSlice';
import { AppState } from '../../shared/types';

export const store = configureStore({
	reducer: {
		filetree: FileTreeReducer,
		editor: EditorReducer,
		project: ProjectReducer,
		builds: BuildsReducer,
		sidebar: SidebarReducer,
		storage: StorageReducer
	}
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const resetAllSlices = (dispatch: AppDispatch) => {
	dispatch(FileTreeActions.clear());
	dispatch(EditorActions.clear());
	dispatch(ProjectActions.clear());
	dispatch(BuildsActions.clear());
	dispatch(SidebarActions.clear());
}
