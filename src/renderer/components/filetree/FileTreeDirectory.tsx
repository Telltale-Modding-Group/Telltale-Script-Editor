import {EditorFile} from '../../../shared/types';
import * as React from 'react';
import {MouseEventHandler, useState} from 'react';
import {BiChevronDown, BiChevronUp} from 'react-icons/bi';
import {AiOutlineFolder} from 'react-icons/ai';
import {Collapse, Text} from '@mantine/core';
import {FileTreeFile} from './FileTreeFile';
import styles from './FileTreeDirectory.module.css';
import fileStyles from './FileTreeFile.module.css';
import classNames from 'classnames';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {FileTreeActions} from '../../slices/FileTreeSlice';

type FileTreeDirectoryProps = {
	directory: EditorFile,
	indentation: number
};

export const FileTreeDirectory = ({directory, indentation}: FileTreeDirectoryProps) => {
	if (!directory.directory) return null;

	const dispatch = useAppDispatch();

	const selectedPath = useAppSelector(state => state.filetree.selectedPath);
	const selected = directory.path === selectedPath;

	const [expanded, setExpanded] = useState(false);
	const toggle = () => setExpanded(!expanded);

	const handleClick = () => dispatch(FileTreeActions.setSelectedPath(directory.path));

	const handleToggleIconClick: MouseEventHandler = (e) => {
		e.stopPropagation();
		toggle();
	};

	return <>
		<div
			className={classNames(styles.container, { [fileStyles.selected]: selected })}
			style={{paddingLeft: `${indentation}rem`}}
			onClick={handleClick}
			onDoubleClick={toggle}
		>
			<BiChevronUp className={styles.icon} onClick={handleToggleIconClick} style={{ transform: `rotate(${expanded ? '180deg' : '0'})` }}/>
			<AiOutlineFolder className={styles.icon} />
			<Text className={fileStyles.text}>{directory.name}</Text>
		</div>
		<Collapse in={expanded}>
			{directory.children.map(child => child.directory
				? <FileTreeDirectory
					key={child.path}
					directory={child}
					indentation={indentation + 1}
				/>
				: <FileTreeFile
					key={child.path}
					file={child}
					indentation={indentation + 1}
				/>
			)}
		</Collapse>
	</>
};