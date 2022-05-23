import styles from './Sidebar.module.css';
import {Button, Code, Group, MediaQuery, Stack} from '@mantine/core';
import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {BuildsActions} from '../slices/BuildsSlice';
import {MainProcess} from '../MainProcessUtils';

export const Builds = () => {
	const dispatch = useAppDispatch();
	const logs = useAppSelector(state => state.builds.logs);

	const handleClearLogs = () => dispatch(BuildsActions.clear());

	const handleOpenBuildsDirectory = () => {
		MainProcess.openBuildsDirectory();
	};

	return <div className={styles.stackContainer}>
		<Stack className={styles.stack}>
			<Code block className={styles.logs}>
				{logs.join('\n')}
			</Code>

			<MediaQuery query="min-width: 501px" styles={{}}>
				<Group position="right" p="xs">
					<Button onClick={handleOpenBuildsDirectory}>Open Builds Directory</Button>
					<Button onClick={handleClearLogs} color="red">Clear</Button>
				</Group>
			</MediaQuery>
		</Stack>
	</div>
};