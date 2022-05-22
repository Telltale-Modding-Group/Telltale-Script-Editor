import {configureStore} from '@reduxjs/toolkit';
import {FileTreeActions, FileTreeReducer} from './FileTreeSlice';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {EditorActions, EditorReducer} from './EditorSlice';
import {ProjectActions, ProjectReducer} from './ProjectSlice';
import {LogActions, LogReducer} from './LogSlice';
import {SidebarActions, SidebarReducer} from './SidebarSlice';
import {LocalStoreReducer} from './LocalStoreSlice';

export const store = configureStore({
	reducer: {
		filetree: FileTreeReducer,
		editor: EditorReducer,
		project: ProjectReducer,
		log: LogReducer,
		sidebar: SidebarReducer,
		localstore: LocalStoreReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const resetAllSlices = (dispatch: AppDispatch) => {
	dispatch(FileTreeActions.clear());
	dispatch(EditorActions.clear());
	dispatch(ProjectActions.clear());
	dispatch(LogActions.clear());
	dispatch(SidebarActions.clear());
}