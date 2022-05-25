import * as React from 'react';
import {useEffect} from 'react';
import 'normalize.css/normalize.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import {NoProjectOpen} from './NoProjectOpen';
import {Project} from './Project';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {useDocumentTitle} from '@mantine/hooks';
import {MainProcess} from '../MainProcessUtils';
import {iterateFiles} from '../utils';
import {EditorAsyncActions} from '../slices/EditorSlice';
import {useModals} from '@mantine/modals';
import {showNotification} from '@mantine/notifications';
import {useStorageStateSync} from '../slices/StorageSlice';
import {useProjectSideEffects} from '../slices/ProjectSlice';
import {LoadingOverlay} from '@mantine/core';
import {SpotlightAction, SpotlightProvider} from '@mantine/spotlight';
import {useBuildProject} from '../hooks';
import {handleOpenProject} from '../ProjectUtils';

export const App = () => {
	const dispatch = useAppDispatch();
	const modals = useModals();

	const root = useAppSelector(state => state.filetree.root);
	const tseproj = root?.directory ? root?.children.find(file => file.name.includes('.tseproj')) : undefined;
	const projectDetails = useAppSelector(state => state.project.currentProject?.mod);
	const showOverlay = useAppSelector(state => state.overlay.visible);

	const title = `Telltale Script Editor${projectDetails ? ` - ${projectDetails.name} v${projectDetails.version} by ${projectDetails.author}` : ''}`;
	useDocumentTitle(title);

	useEffect(() => {
		const handlers = [
			MainProcess.handleMenuOpenProject(() => handleOpenProject(dispatch)),
			MainProcess.handleMenuProjectSettings(() => tseproj ? dispatch(EditorAsyncActions.openFile(tseproj)) : null),
			MainProcess.handleMenuNewProject(() => modals.openContextModal('newproject', { innerProps: {} })),
			MainProcess.handleMenuAbout(() =>
				modals.openContextModal('about', { innerProps: {}, styles: { modal: { alignSelf: 'center' } } })
			),
			MainProcess.handleMenuSettings(() =>
				modals.openContextModal('settings', { innerProps: {} })
			),
			MainProcess.handleMenuNotImplemented(() => showNotification({
				title: 'Not Implemented',
				message: "Sorry, that feature isn't implemented just yet",
				color: 'yellow'
			}))
		];

		return () => handlers.forEach(unsubscribe => unsubscribe());
	}, [tseproj]);

	useStorageStateSync();
	useProjectSideEffects();

	const { buildProject, buildProjectAndRun } = useBuildProject();

	const Actions: SpotlightAction[] = [
		{
			title: 'Build Project',
			onTrigger: buildProject
		},
		{
			title: 'Build Project and Run',
			onTrigger: buildProjectAndRun
		}
	];

	const FileActions: SpotlightAction[] = !root ? [] : iterateFiles(root).filter(file => !file.path.includes('Build')).map(file => ({
		title: file.name,
		onTrigger: () => {
			dispatch(EditorAsyncActions.openFile(file));
		}
	}));

	return <SpotlightProvider
		actions={[...Actions, ...FileActions]}
		searchPlaceholder="Search files..."
		nothingFoundMessage="No files found..."
	>
		<LoadingOverlay visible={showOverlay} sx={{ 'svg': { height: '125px', width: '125px' } }} />
		{root ? <Project /> : <NoProjectOpen />}
	</SpotlightProvider>
};
