import {configureStore} from '@reduxjs/toolkit';
import {FileTreeActions, FileTreeReducer} from './FileTreeSlice';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {EditorActions, EditorReducer} from './EditorSlice';
import {ProjectActions, ProjectReducer} from './ProjectSlice';

export const store = configureStore({
	reducer: {
		filetree: FileTreeReducer,
		editor: EditorReducer,
		project: ProjectReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const resetAllSlices = (dispatch: AppDispatch) => {
	console.log('clearing slices...');
	dispatch(FileTreeActions.clear());
	dispatch(EditorActions.clear());
	dispatch(ProjectActions.clear());
}