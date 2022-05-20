import * as React from 'react';
import {useEffect} from 'react';
import 'react-resizable/css/styles.css';
import 'normalize.css/normalize.css';
import {NoProjectOpen} from './NoProjectOpen';
import {Project} from './Project';
import {AppDispatch, useAppDispatch, useAppSelector} from '../slices/store';
import {useDocumentTitle} from '@mantine/hooks';
import {MainProcess} from '../MainProcessUtils';
import {handleOpenProject} from '../utils';
import {EditorAsyncActions} from '../slices/EditorSlice';
import {EditorFile} from '../../shared/types';
import {useModals} from '@mantine/modals';
import {showNotification} from '@mantine/notifications';

const useMenuOpenProjectListener = (dispatch: AppDispatch) => useEffect(() =>
	MainProcess.handleMenuOpenProject(() => handleOpenProject(dispatch)),
	[]
);

const useMenuProjectSettingsListener = (dispatch: AppDispatch, tsprojFile: EditorFile | undefined) => useEffect(() =>
	MainProcess.handleMenuProjectSettings(() => tsprojFile ? dispatch(EditorAsyncActions.openFile(tsprojFile)) : null),
	[tsprojFile]
);

const useMenuNewProjectListener = (dispatch: AppDispatch, modals: ReturnType<typeof useModals>) => useEffect(() =>
	MainProcess.handleMenuNewProject(() => modals.openContextModal('newproject', { innerProps: {} })),
	[]
);

// TODO: Remove once everything is good to go
const useMenuNotImplementedListener = () => useEffect(() =>
	MainProcess.handleMenuNotImplemented(() => showNotification({
		title: 'Not Implemented',
		message: "Sorry, that feature isn't implemented just yet",
		color: 'yellow'
	})),
	[]);

export const App = () => {
	const dispatch = useAppDispatch();
	const modals = useModals();

	const root = useAppSelector(state => state.filetree.root);
	
	if (root && !root.directory) return null;
	
	const projectDetails = useAppSelector(state => state.project.currentProject?.mod);

	const title = `Telltale Script Editor${projectDetails ? ` - ${projectDetails.name} v${projectDetails.version} by ${projectDetails.author}` : ''}`;
	useDocumentTitle(title);

	useMenuOpenProjectListener(dispatch);
	useMenuProjectSettingsListener(dispatch, root?.children.find(file => file.name.includes('.tseproj')));
	useMenuNewProjectListener(dispatch, modals);
	// TODO: Remove once everything is good to go
	useMenuNotImplementedListener();

	return root ? <Project /> : <NoProjectOpen />;
};
