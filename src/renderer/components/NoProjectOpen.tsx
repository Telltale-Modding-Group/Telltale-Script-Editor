import styles from './NoProjectOpen.module.css';
import {showNotification} from '@mantine/notifications';
import {AiFillFolderOpen, AiOutlinePlus} from 'react-icons/ai';
import {Text} from '@mantine/core';
import * as React from 'react';
import {handleOpenProject} from '../utils';
import {useAppDispatch} from '../slices/store';
import {useModals} from '@mantine/modals';

export const NoProjectOpen = () => {
	const dispatch = useAppDispatch();
	const modals = useModals();

	const handleNewProjectClicked = () => modals.openContextModal('newproject', {innerProps: {}});
	const handleOpenProjectClicked = () => handleOpenProject(dispatch);

	return <div className={styles.noProjectOpenContainer}>
		<div style={{ display: 'flex' }}>
			<button className={styles.openButton} onClick={handleNewProjectClicked}>
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
