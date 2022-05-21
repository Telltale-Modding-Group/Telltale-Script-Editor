import styles from './Navbar.module.css';
import {ActionIcon} from '@mantine/core';
import {BsHammer} from 'react-icons/bs';
import {AiOutlineCaretRight} from 'react-icons/ai';
import * as React from 'react';
import {useEffect} from 'react';
import {MainProcess} from '../MainProcessUtils';
import {LogActions} from '../slices/LogSlice';
import {SidebarActions} from '../slices/SidebarSlice';
import {showNotification} from '@mantine/notifications';
import {ProjectActions} from '../slices/ProjectSlice';
import {useAppDispatch, useAppSelector} from '../slices/store';

export const Navbar = () => {
	const dispatch = useAppDispatch();
	const root = useAppSelector(state => state.filetree.root);
	const project = useAppSelector(state => state.project.currentProject);
	const gameExePath = useAppSelector(state => state.project.gameExePath);

	if (!root || !project) return null;

	useEffect(() =>
		MainProcess.handleBuildProjectLog(log => dispatch(LogActions.addLog(log))),
	[]
	);

	const handleBuildProject = async () => {
		dispatch(LogActions.clear());
		dispatch(SidebarActions.setActiveTab('logs'));
		await MainProcess.buildProject({ projectPath: root.path, project });
		showNotification({ title: 'Build Successful', message: 'The project was built successfully!', color: 'green' });
	};

	useEffect(() =>
		MainProcess.handleMenuBuildProject(handleBuildProject),
	[root.path, project]
	);

	const handleBuildThenRun = async () => {
		if (!gameExePath) {
			const selection = await MainProcess.getGamePathChannel();

			if (!selection) return;

			dispatch(ProjectActions.setGameExePath(selection));
		}
	};

	return <div className={styles.navbarContainer}>
		<div className={styles.navbarButtonsContainer}>
			<ActionIcon color='green' onClick={handleBuildProject}>
				<BsHammer />
			</ActionIcon>
			<ActionIcon color='green'>
				<AiOutlineCaretRight />
			</ActionIcon>
		</div>
	</div>;
};