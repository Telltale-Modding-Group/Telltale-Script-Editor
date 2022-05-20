import {Text} from '@mantine/core';
import * as React from 'react';
import {EditorFile} from '../../../shared/types';
import styles from './FileTreeFile.module.css';
import classNames from 'classnames';
import {isSupported} from '../../FileUtils';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {FileTreeActions} from '../../slices/FileTreeSlice';
import {EditorAsyncActions} from '../../slices/EditorSlice';
import {showNotification} from '@mantine/notifications';

type FileTreeFileProps = {
	file: EditorFile,
	indentation: number
};

export const FileTreeFile = ({file, indentation}: FileTreeFileProps) => {
	const dispatch = useAppDispatch();

	const selectedPath = useAppSelector(state => state.filetree.selectedPath);
	const selected = selectedPath === file.path;
	const supported = isSupported(file);

	const handleClick = () => dispatch(FileTreeActions.setSelectedPath(file.path));
	const handleDoubleClick = () => {
		if (!supported) {
			return showNotification({
				title: 'Unable to open file',
				message: `${file.name} is an unsupported file.`,
				color: 'red'
			});
		}

		dispatch(EditorAsyncActions.openFile(file));
	}

	return <div
		className={classNames({[styles.selected]: selected})}
		style={{paddingLeft: `${indentation + 1.4}rem`}}
        onClick={handleClick}
		onDoubleClick={handleDoubleClick}
	>
		<Text className={classNames(styles.text, {[styles.unsupported]: !supported})}>
			{file.name}
		</Text>
	</div>
};