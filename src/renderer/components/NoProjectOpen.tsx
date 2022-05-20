import styles from './NoProjectOpen.module.css';
import {showNotification} from '@mantine/notifications';
import {AiFillFolderOpen, AiOutlinePlus} from 'react-icons/ai';
import {Text} from '@mantine/core';
import * as React from 'react';
import { useAppDispatch } from '../slices/store';
import { MainProcess } from '../MainProcessUtils';
import {FileTreeActions} from '../slices/FileTreeSlice';
import {ProjectActions} from '../slices/ProjectSlice';

export const NoProjectOpen = () => {
	const dispatch = useAppDispatch();

	const handleOpenProjectClicked = async () => {
		const project = await MainProcess.openProject();

		if (!project) return;

		dispatch(FileTreeActions.setRootDirectory(project.root));

		// TODO: Handle invalid .tseproj files
		dispatch(ProjectActions.setProject(JSON.parse(project.tseproj)));
	};

	return <div className={styles.noProjectOpenContainer}>
		<div style={{ display: 'flex' }}>
			<button className={styles.openButton} onClick={() => showNotification({ title: 'Not yet implemented', message: 'New projects are not yet supported, sorry!', color: 'red' })}>
				<AiOutlinePlus fontSize="10rem" />
				<Text>New Project</Text>
			</button>
			<button className={styles.openButton} onClick={handleOpenProjectClicked}>
				<AiFillFolderOpen fontSize="10rem" />
				<Text>Open Project</Text>
			</button>
		</div>
	</div>;
};
