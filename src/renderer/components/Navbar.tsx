import styles from './Navbar.module.css';
import {ActionIcon, Group} from '@mantine/core';
import {BsHammer} from 'react-icons/bs';
import {AiFillSetting, AiOutlineCaretRight, AiOutlineSetting} from 'react-icons/ai';
import * as React from 'react';
import {useEffect} from 'react';
import {MainProcess} from '../MainProcessUtils';
import {BuildsActions, useBuildsSideEffects} from '../slices/BuildsSlice';
import {SidebarActions} from '../slices/SidebarSlice';
import {showNotification} from '@mantine/notifications';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {FileTreeAsyncActions} from '../slices/FileTreeSlice';
import {StorageActions} from '../slices/StorageSlice';
import {useModals} from '@mantine/modals';

export const Navbar = () => {
	const dispatch = useAppDispatch();
	const root = useAppSelector(state => state.filetree.root);
	const project = useAppSelector(state => state.project.currentProject);
	const gameExePath = useAppSelector(state => state.storage.gamePath);
	const modals = useModals();

	if (!root || !project) return null;

	useBuildsSideEffects();

	const handleBuildProject = async () => {
		dispatch(BuildsActions.clearLogs());
		dispatch(SidebarActions.setActiveTab('logs'));
		const buildZipPath = await MainProcess.buildProject({ projectPath: root.path, project });
		dispatch(FileTreeAsyncActions.refreshRootDirectory());

		if (!buildZipPath) {
			showNotification({
				title: 'Build Failed',
				message: 'An error occurred during build compilation. Check the logs for more details.',
				color: 'red'
			});
		} else {
			showNotification({
				title: 'Build Successful',
				message: 'The project was built successfully!',
				color: 'green'
			});
		}

		return buildZipPath;
	};

	const handleBuildAndRun = async () => {
		let gamePath = gameExePath;

		if (!gamePath) {
			gamePath = await MainProcess.getGamePath();

			if (!gamePath) return;

			dispatch(StorageActions.setGamePath(gamePath));
		}

		const buildZipPath = await handleBuildProject();

		if (!buildZipPath) return;

		await MainProcess.runProject({ buildZipPath, gamePath });
	};

	useEffect(() => {
		const handlers = [
			MainProcess.handleMenuBuildProject(handleBuildProject),
			MainProcess.handleMenuBuildAndRunProject(handleBuildAndRun)
		];

		return () => handlers.forEach(unsubscribe => unsubscribe());
	}, [root.path, project, gameExePath]);

	const handleOpenSettings = () => {
		modals.openContextModal('settings', { innerProps: {} });
	};

	return <div className={styles.navbarContainer}>
		<Group position="center" spacing="xs">
			<ActionIcon color='gray' onClick={handleOpenSettings}>
				<AiFillSetting size={16} />
			</ActionIcon>
			<ActionIcon color='green' onClick={handleBuildAndRun}>
				<AiOutlineCaretRight size={20} />
			</ActionIcon>
			<ActionIcon color='green' onClick={handleBuildProject}>
				<BsHammer size={16} />
			</ActionIcon>
		</Group>
	</div>;
};