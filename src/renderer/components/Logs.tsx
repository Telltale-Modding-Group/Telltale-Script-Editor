import styles from './Sidebar.module.css';
import {Button, Code, Group, Stack} from '@mantine/core';
import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {LogActions} from '../slices/LogSlice';

export const Logs = () => {
	const dispatch = useAppDispatch();
	const logs = useAppSelector(state => state.log.logs);

	const handleClearLogs = () => dispatch(LogActions.clear());

	return <div className={styles.stackContainer}>
		<Stack className={styles.stack}>
			<Code block className={styles.logs}>
				{logs.join('\n')}
			</Code>

			<Group position="right" p="xs">
				<Button onClick={handleClearLogs}>Clear</Button>
			</Group>
		</Stack>
	</div>
};