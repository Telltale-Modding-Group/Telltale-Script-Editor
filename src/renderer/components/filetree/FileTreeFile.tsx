import {Text} from '@mantine/core';
import * as React from 'react';
import {EditorFile} from '../../../shared/types';
import styles from './FileTreeFile.module.css';
import classNames from 'classnames';
import {isSupported} from '../../FileUtils';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {FileTreeActions} from '../../slices/FileTreeSlice';
import {EditorAsyncActions} from '../../slices/EditorSlice';

type FileTreeFileProps = {
	file: EditorFile,
	indentation: number
};

export const FileTreeFile = ({file, indentation}: FileTreeFileProps) => {
	const dispatch = useAppDispatch();

	const selectedPath = useAppSelector(state => state.filetree.selectedPath);
	const selected = selectedPath === file.path;

	const handleClick = () => dispatch(FileTreeActions.setSelectedPath(file.path));
	const handleDoubleClick = () => dispatch(EditorAsyncActions.openFile(file));

	return <div
		className={classNames({[styles.selected]: selected})}
		style={{paddingLeft: `${indentation + 1.4}rem`}}
        onClick={handleClick}
		onDoubleClick={handleDoubleClick}
	>
		<Text className={classNames(styles.text, {[styles.unsupported]: !isSupported(file)})}>
			{file.name}
		</Text>
	</div>
};