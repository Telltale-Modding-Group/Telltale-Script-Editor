import styles from './Sidebar.module.css';
import {Button, Code, Group, Stack} from '@mantine/core';
import * as React from 'react';
import {useAppSelector} from '../slices/store';

export const Logs = () => {
	const logs = useAppSelector(state => state.log.logs);

	return <div className={styles.stackContainer}>
		<Stack className={styles.stack}>
			<Code block className={styles.logs}>
				{logs.join('\n')}
			</Code>

			<Group position="right" p="xs">
				<Button>Clear</Button>
			</Group>
		</Stack>
	</div>
};