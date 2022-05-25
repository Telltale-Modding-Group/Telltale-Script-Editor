import styles from './Navbar.module.css';
import {ActionIcon, Group, Space, Text, Tooltip, UnstyledButton} from '@mantine/core';
import {BsHammer} from 'react-icons/bs';
import {AiFillSetting, AiOutlineCaretRight, AiOutlineSearch} from 'react-icons/ai';
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
import {useSpotlight} from '@mantine/spotlight';
import {useBuildProject} from '../hooks';

export const Navbar = () => {
	const root = useAppSelector(state => state.filetree.root);
	const project = useAppSelector(state => state.project.currentProject);
	const gameExePath = useAppSelector(state => state.storage.gamePath);
	const modals = useModals();
	const spotlight = useSpotlight();

	if (!root || !project) return null;

	useBuildsSideEffects();
	const { buildProject, buildProjectAndRun } = useBuildProject();

	useEffect(() => {
		const handlers = [
			MainProcess.handleMenuBuildProject(buildProject),
			MainProcess.handleMenuBuildAndRunProject(buildProjectAndRun)
		];

		return () => handlers.forEach(unsubscribe => unsubscribe());
	}, [root.path, project, gameExePath]);

	const handleOpenSettings = () => {
		modals.openContextModal('settings', { innerProps: {} });
	};

	return <div className={styles.navbarContainer}>
		<Group position="center" spacing="xs">
			<Tooltip label="Settings" openDelay={500}>
				<ActionIcon color='gray' onClick={handleOpenSettings}>
					<AiFillSetting size={16} />
				</ActionIcon>
			</Tooltip>
			<Tooltip label="Build and Run" openDelay={500}>
				<ActionIcon color='green' onClick={buildProjectAndRun}>
					<AiOutlineCaretRight size={20} />
				</ActionIcon>
			</Tooltip>
			<Tooltip label="Build" openDelay={500}>
				<ActionIcon color='green' onClick={buildProject}>
					<BsHammer size={16} />
				</ActionIcon>
			</Tooltip>
		</Group>
		<UnstyledButton className={styles.searchButton} onClick={() => spotlight.openSpotlight()}>
			<AiOutlineSearch />
			<Space w="xs" />
			<Text className={styles.searchButtonText}>Search...</Text>
		</UnstyledButton>
	</div>;
};