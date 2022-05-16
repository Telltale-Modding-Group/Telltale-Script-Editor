import styles from './NoProjectOpen.module.css';
import {showNotification} from '@mantine/notifications';
import {AiFillFolderOpen, AiOutlinePlus} from 'react-icons/ai';
import {Text} from '@mantine/core';
import * as React from 'react';

type NoProjectOpenProps = {
	onOpenProject: () => Promise<void>
};

export const NoProjectOpen = ({ onOpenProject }: NoProjectOpenProps) => {
	return <div className={styles.noProjectOpenContainer}>
		<div style={{ display: 'flex' }}>
			<button className={styles.openButton} onClick={() => showNotification({ title: 'Not yet implemented', message: 'New projects are not yet supported, sorry!', color: 'red' })}>
				<AiOutlinePlus fontSize="10rem" />
				<Text>New Project</Text>
			</button>
			<button className={styles.openButton} onClick={onOpenProject}>
				<AiFillFolderOpen fontSize="10rem" />
				<Text>Open Project</Text>
			</button>
		</div>
	</div>;
};