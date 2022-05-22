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
import {FileTreeAsyncActions} from '../slices/FileTreeSlice';

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
		const buildZipPath = await MainProcess.buildProject({ projectPath: root.path, project });
		dispatch(FileTreeAsyncActions.refreshRootDirectory());
		showNotification({ title: 'Build Successful', message: 'The project was built successfully!', color: 'green' });

		return buildZipPath;
	};

	useEffect(() =>
		MainProcess.handleMenuBuildProject(handleBuildProject),
	[root.path, project]
	);

	const handleBuildAndRun = async () => {
		let gamePath = gameExePath;

		if (!gamePath) {
			gamePath = await MainProcess.getGamePath();

			if (!gamePath) return;

			dispatch(ProjectActions.setGameExePath(gamePath));
		}

		const buildZipPath = await handleBuildProject();

		await MainProcess.runProject({ buildZipPath, gamePath });
	};

	useEffect(() =>
		MainProcess.handleMenuBuildAndRunProject(handleBuildAndRun),
		[gameExePath]
	);

	return <div className={styles.navbarContainer}>
		<div className={styles.navbarButtonsContainer}>
			<ActionIcon color='green' onClick={handleBuildProject}>
				<BsHammer />
			</ActionIcon>
			<ActionIcon color='green' onClick={handleBuildAndRun}>
				<AiOutlineCaretRight />
			</ActionIcon>
		</div>
	</div>;
};