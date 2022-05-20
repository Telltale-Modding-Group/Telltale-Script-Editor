import {configureStore} from '@reduxjs/toolkit';
import {FileTreeReducer} from './FileTreeSlice';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {EditorReducer} from './EditorSlice';
import {ProjectReducer} from './ProjectSlice';

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