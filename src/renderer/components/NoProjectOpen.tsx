import styles from './NoProjectOpen.module.css';
import {AiFillFolderOpen, AiOutlinePlus} from 'react-icons/ai';
import {Col, Grid, Space, Text, Title, UnstyledButton} from '@mantine/core';
import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {useModals} from '@mantine/modals';
import {MainProcess} from '../MainProcessUtils';
import {RecentProject} from '../types';
import {OverlayActions} from '../slices/OverlaySlice';
import {showNotification} from '@mantine/notifications';
import {StorageActions} from '../slices/StorageSlice';
import {handleOpenProject, openProject} from '../ProjectUtils';

export const NoProjectOpen = () => {
	const dispatch = useAppDispatch();
	const modals = useModals();
	const recentProjects = useAppSelector(state => state.storage.recentProjects);

	const hasRecentProjects = recentProjects.length > 0;

	const handleNewProjectClicked = () => modals.openContextModal('newproject', {innerProps: {}});
	const handleOpenProjectClicked = () => handleOpenProject(dispatch);

	const handleOpenRecentProject = async ({ project, tseprojPath }: RecentProject) => {
		dispatch(OverlayActions.show());

		const root = await MainProcess.getDirectory(tseprojPath.replace(/[/\\][^/|\\]+$/g, ''));

		if (!root) {
			showNotification({
				title: 'Unable to open project',
				message: `There was an error opening ${project.mod.name}, removing from recent projects list...`,
				color: 'red'
			});

			dispatch(StorageActions.removeRecentProject({ project, tseprojPath }));
		} else {
			openProject(dispatch, root, project);
		}

		dispatch(OverlayActions.hide());
	}

	return <div className={styles.noProjectOpenContainer}>
		<Grid style={{ margin: 0, height: '100%' }}>
			<Col span={hasRecentProjects ? 9 : 12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid black' }}>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ textAlign: 'center' }}>
						<Title>Welcome to the Telltale Script Editor!</Title>
						<Text>Create a new project or open an existing project to get started...</Text>
					</div>
					<Space h="xl" />
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<button className={styles.openButton} onClick={handleNewProjectClicked}>
							<AiOutlinePlus fontSize="9rem" />
							<Text>New Project</Text>
						</button>
						<button className={styles.openButton} onClick={handleOpenProjectClicked}>
							<AiFillFolderOpen fontSize="9rem" />
							<Text>Open Project</Text>
						</button>
					</div>
				</div>
			</Col>
			{ hasRecentProjects &&
				<Col span={3} style={{ backgroundColor: '#ebebeb', padding: '1rem 0 0 0' }}>
					<Title order={3} style={{ textAlign: 'center' }}>Recent Projects</Title>
					<Space h="xl" />
					{recentProjects.map(recentProject =>
						<UnstyledButton
							key={recentProject.tseprojPath}
							onClick={() => handleOpenRecentProject(recentProject)}
							className={styles.recentProject}
						>
							<Text>{recentProject.project.mod.name}</Text>
						</UnstyledButton>
					)}
				</Col>
			}
		</Grid>


	</div>;
};
