import styles from './NoProjectOpen.module.css';
import {AiFillFolderOpen, AiOutlineClose, AiOutlinePlus} from 'react-icons/ai';
import {Button, Col, Grid, Group, Modal, Space, Stack, Text, Title, UnstyledButton} from '@mantine/core';
import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {useModals} from '@mantine/modals';
import {MainProcess} from '../MainProcessUtils';
import {RecentProject} from '../types';
import {OverlayActions} from '../slices/OverlaySlice';
import {showNotification} from '@mantine/notifications';
import {StorageActions} from '../slices/StorageSlice';
import {handleOpenProject, openProject} from '../ProjectUtils';
import {dirname} from '../utils';
import {useState} from 'react';
import classNames from 'classnames';

export const NoProjectOpen = () => {
	const dispatch = useAppDispatch();
	const modals = useModals();
	const recentProjects = useAppSelector(state => state.storage.recentProjects);

	const hasRecentProjects = recentProjects.length > 0;

	const handleNewProjectClicked = () => modals.openContextModal('newproject', {innerProps: {}});
	const handleOpenProjectClicked = () => handleOpenProject(dispatch);

	const handleOpenRecentProject = async ({ project, tseprojPath }: RecentProject) => {
		dispatch(OverlayActions.show());

		const root = await MainProcess.getDirectory(dirname(tseprojPath));

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

	const [selectedRecentProject, setSelectedRecentProject] = useState<RecentProject | undefined>();
	const recentProjectName = selectedRecentProject?.project.mod.name

	const hideModal = () => setSelectedRecentProject(undefined);

	const handleRemoveRecentProject = () => {
		if (!selectedRecentProject) return;
		dispatch(StorageActions.removeRecentProject(selectedRecentProject));
		hideModal();
	};

	const [deletingProject, setDeletingProject] = useState(false);

	const handleDeleteRecentProject = async () => {
		if (!selectedRecentProject) return;
		setDeletingProject(true);
		await MainProcess.deleteFile({ directory: false, name: '', path: dirname(selectedRecentProject.tseprojPath) });
		setDeletingProject(false);
		dispatch(StorageActions.removeRecentProject(selectedRecentProject));
		hideModal();
	};

	const handleRemoveRecentProjectButtonClicked = (e: React.MouseEvent, project: RecentProject) => {
		e.stopPropagation();
		setSelectedRecentProject(project);
	};

	return <div className={styles.noProjectOpenContainer}>
		<Modal opened={!!selectedRecentProject} onClose={hideModal} withCloseButton={false}>
			<Stack>
				<Title order={2}>Remove {recentProjectName}</Title>
				<Text>Do you want to remove {recentProjectName} from recent projects or delete the project?</Text>
				<Space h="md" />
				<Group position="right" spacing="xs">
					<Button color="gray" onClick={hideModal}>Cancel</Button>
					<Button color="red" onClick={handleDeleteRecentProject} loading={deletingProject} loaderPosition="right">
						Delete
					</Button>
					<Button color="blue" onClick={handleRemoveRecentProject}>
						Remove
					</Button>
				</Group>
			</Stack>
		</Modal>
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
				<Col span={3} style={{ height: '100%', display: 'flex', flexDirection: 'column' }} p={0}>
					<Title order={3} style={{ textAlign: 'center', borderBottom: '1px solid black' }} py="1rem">Recent Projects</Title>
					<div style={{ overflowY: 'auto', flexGrow: 1, minHeight: 0 }}>
						{recentProjects.map(recentProject =>
							<UnstyledButton
								key={recentProject.tseprojPath}
								onClick={() => handleOpenRecentProject(recentProject)}
								className={classNames(styles.recentProject, {[styles.selectedRecentProject]: selectedRecentProject?.tseprojPath === recentProject.tseprojPath})}
							>
								<div style={{ flexGrow: 1 }}>
									<Text>{recentProject.project.mod.name}</Text>
									<Text color="dimmed" size="xs">{dirname(recentProject.tseprojPath)}</Text>
								</div>
								<AiOutlineClose className={styles.recentProjectRemove} onClick={e => handleRemoveRecentProjectButtonClicked(e, recentProject)}/>
							</UnstyledButton>
						)}
					</div>
				</Col>
			}
		</Grid>


	</div>;
};
