import {EditorFile} from '../../../shared/types';
import * as React from 'react';
import {MouseEventHandler, useState} from 'react';
import {BiChevronUp} from 'react-icons/bi';
import {AiOutlineFolder} from 'react-icons/ai';
import {Text, TextInput} from '@mantine/core';
import {FileTreeFile} from './FileTreeFile';
import styles from './FileTreeDirectory.module.css';
import fileStyles from './FileTreeFile.module.css';
import classNames from 'classnames';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {FileTreeActions, FileTreeAsyncActions} from '../../slices/FileTreeSlice';
import {MainProcess} from '../../MainProcessUtils';
import {EditorActions} from '../../slices/EditorSlice';

type FileTreeDirectoryProps = {
	directory: EditorFile,
	indentation: number
};

export const FileTreeDirectory = ({directory, indentation}: FileTreeDirectoryProps) => {
	if (!directory.directory) return null;

	const path = directory.path;

	const dispatch = useAppDispatch();
	const selectedPath = useAppSelector(state => state.filetree.selectedPath);
	const renamingFilePath = useAppSelector(state => state.filetree.renamingFilePath);
	const expandedDirectories = useAppSelector(state => state.filetree.expandedDirectories);

	const renaming = renamingFilePath === directory.path;
	const expanded = expandedDirectories[path];
	const selected = path === selectedPath;

	const toggle = () => dispatch(FileTreeActions.toggleDirectory(path));

	const handleClick = () => dispatch(FileTreeActions.setSelectedPath(path));

	const handleToggleIconClick: MouseEventHandler = (e) => {
		e.stopPropagation();
		toggle();
	};

	const [newDirectoryName, setNewDirectoryName] = useState(directory.name);

	const handleRenameSubmit = async () => {
		dispatch(FileTreeActions.setRenamingFilePath());

		if (newDirectoryName === directory.name) return;

		const newPath = await MainProcess.renameFile({ file: directory, newName: newDirectoryName });

		// If we're renaming the root directory, a normal refresh will no longer find the root.
		if (indentation === 0) {
			dispatch(FileTreeAsyncActions.setRootDirectoryFromPath(newPath));
		} else {
			dispatch(FileTreeAsyncActions.refreshRootDirectory())
		}

		dispatch(EditorActions.handleRename({ oldPath: path, newPath }));
	};

	const handleRightClick: MouseEventHandler<HTMLDivElement> = e => {
		handleClick();
		dispatch(FileTreeActions.setContextMenuAnchorPoint({ x: e.clientX, y: e.clientY}));
		dispatch(FileTreeActions.setContextMenuFile(directory));
	};

	const hasChildren = directory.children.length > 0;

	return <>
		<div
			className={classNames(styles.container, { [fileStyles.selected]: selected })}
			style={{paddingLeft: `${indentation}rem`}}
			onClick={handleClick}
			onDoubleClick={toggle}
			onContextMenu={handleRightClick}
		>
			<BiChevronUp
				className={styles.icon}
				onClick={handleToggleIconClick}
				style={{ transform: `rotate(${expanded ? '0' : '180deg' })`, visibility: hasChildren ? 'visible' : 'hidden' }}
			/>
			<AiOutlineFolder className={styles.icon} />
			{ renaming
				// Using a form here SOLELY to make it easier to listen for enter pressed
				? <form onSubmit={e => { e.preventDefault(); handleRenameSubmit(); } } style={{ width: '100%' }}>
						<TextInput
						autoFocus
						value={newDirectoryName}
						onChange={e => setNewDirectoryName(e.target.value)}
						size="xs"
						styles={{ root: { width: '100%' } }}
						onBlur={handleRenameSubmit}
					/>
				</form>
				: <Text className={fileStyles.text}>{directory.name}</Text>
			}
		</div>
		{expanded && directory.children.map(child => child.directory
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
	</>
};