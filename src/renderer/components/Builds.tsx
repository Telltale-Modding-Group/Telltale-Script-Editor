import styles from './Sidebar.module.css';
import {ActionIcon, Button, Code, Group, Stack} from '@mantine/core';
import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {BuildsActions} from '../slices/BuildsSlice';
import {MainProcess} from '../MainProcessUtils';
import {BsFillTrashFill} from 'react-icons/bs';
import {showNotification} from '@mantine/notifications';
import {FileTreeAsyncActions} from "../slices/FileTreeSlice";

export const Builds = () => {
	const dispatch = useAppDispatch();
	const logs = useAppSelector(state => state.builds.logs);
	const root = useAppSelector(state => state.filetree.root);

	if (!root?.directory) return null;

	const handleClearLogs = () => {
		dispatch(BuildsActions.clear());
		showNotification({
			title: 'Build logs cleared',
			message: 'Logs associated with the latest build were cleared!',
			color: 'green'
		});
	}

	const handleOpenBuildsDirectory = () => {
		MainProcess.openBuildsDirectory();
	};

	const handleClearBuildArchives = async () => {
		const buildsDirectory = root.children.find(file => file.name === 'Builds');

		if (!buildsDirectory) return;

		await MainProcess.deleteFile(buildsDirectory);
		dispatch(FileTreeAsyncActions.refreshRootDirectory());

		showNotification({
			title: 'Cleared build archives',
			message: 'All build archives were deleted.',
			color: 'green'
		});
	};

	return <div className={styles.stackContainer}>
		<Stack className={styles.stack}>
			{logs.length > 0 &&
				<div style={{ position: 'absolute', alignSelf: 'end' }}>
					<ActionIcon
						color="red"
						variant="light"
						onClick={handleClearLogs}
						style={{ position: 'relative', top: '1rem', right: '2rem' }}
					>
						<BsFillTrashFill size={14}/>
					</ActionIcon>
				</div>
			}

			<Code block className={styles.logs}>
				{logs.join('\n')}
			</Code>

			<Group position="right" p="xs">
				<Button onClick={handleClearBuildArchives} color="red">Clear Build Archives</Button>
				<Button onClick={handleOpenBuildsDirectory}>Open Builds Directory</Button>
			</Group>
		</Stack>
	</div>
};