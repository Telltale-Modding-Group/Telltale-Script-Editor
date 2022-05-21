import {EditorFile} from '../../../shared/types';
import * as React from 'react';
import {MouseEventHandler, useState} from 'react';
import {BiChevronUp} from 'react-icons/bi';
import {AiOutlineFolder} from 'react-icons/ai';
import {Button, Collapse, Group, Modal, Portal, Space, Stack, Text, TextInput, Title} from '@mantine/core';
import {FileTreeFile} from './FileTreeFile';
import styles from './FileTreeDirectory.module.css';
import fileStyles from './FileTreeFile.module.css';
import classNames from 'classnames';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {FileTreeActions, FileTreeAsyncActions} from '../../slices/FileTreeSlice';
import {ControlledMenu, SubMenu, useMenuState} from '@szhsin/react-menu';
import {MainProcess} from '../../MainProcessUtils';
import {ContextMenuItem} from './ContextMenuItem';
import {EditorActions} from '../../slices/EditorSlice';

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

	const [menuProps, toggleMenu] = useMenuState();
	const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0});

	const [renaming, setRenaming] = useState(false);
	const [newDirectoryName, setNewDirectoryName] = useState(directory.name);

	const handleRename = () => {
		setRenaming(true);
	};

	const handleRenameSubmit = async () => {
		setRenaming(false);

		if (newDirectoryName === directory.name) return;

		const newPath = await MainProcess.renameFile({ file: directory, newName: newDirectoryName });

		// If we're renaming the root directory, a normal refresh will no longer find the root.
		if (indentation === 0) {
			dispatch(FileTreeAsyncActions.setRootDirectoryFromPath(newPath));
		} else {
			dispatch(FileTreeAsyncActions.refreshRootDirectory())
		}

		dispatch(EditorActions.handleRename({ oldPath: directory.path, newPath }));
	};

	const handleRightClick: MouseEventHandler<HTMLDivElement> = e => {
		handleClick();
		setAnchorPoint({ x: e.clientX, y: e.clientY});
		toggleMenu(true);
	};

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const hideDeleteModal = () => setShowDeleteModal(false);

	const handleOpenInExplorer = () => {
		MainProcess.openInExplorer(directory.path);
	};

	const handleDeleteDirectory = async () => {
		hideDeleteModal();

		await MainProcess.deleteFile(directory);

		dispatch(FileTreeAsyncActions.refreshRootDirectory());
		dispatch(EditorActions.handleFileDeleted(directory));
	};

	return <>
		<Modal
			centered
			withCloseButton={false}
			opened={showDeleteModal}
			onClose={hideDeleteModal}
			size="sm"
		>
			<Stack>
				<Title order={2}>Delete Directory</Title>
				<Text>Are you sure you want to delete <em>{directory.name}</em>?</Text>
				<Space h="md" />
				<Group position="right" spacing="xs">
					<Button color="gray" onClick={hideDeleteModal}>Cancel</Button>
					<Button color="red" onClick={handleDeleteDirectory}>
						Delete
					</Button>
				</Group>
			</Stack>
		</Modal>

		<Portal>
			<ControlledMenu
				direction="right"
				anchorPoint={anchorPoint}
				onClose={() => toggleMenu(false)}
				{...menuProps}
			>
				<SubMenu label={() => <Text size="xs">New</Text>}>
					<ContextMenuItem>Directory</ContextMenuItem>
					<ContextMenuItem>Script</ContextMenuItem>
					<ContextMenuItem>File</ContextMenuItem>
				</SubMenu>
				<ContextMenuItem onClick={toggle}>{ expanded ? 'Collapse' : 'Expand' }</ContextMenuItem>
				<ContextMenuItem onClick={handleRename}>Rename</ContextMenuItem>
				<ContextMenuItem onClick={handleOpenInExplorer}>Open in explorer</ContextMenuItem>
				<ContextMenuItem onClick={() => setShowDeleteModal(true)}>Delete</ContextMenuItem>
			</ControlledMenu>
		</Portal>

		<div
			className={classNames(styles.container, { [fileStyles.selected]: selected })}
			style={{paddingLeft: `${indentation}rem`}}
			onClick={handleClick}
			onDoubleClick={toggle}
			onContextMenu={handleRightClick}
		>
			<BiChevronUp className={styles.icon} onClick={handleToggleIconClick} style={{ transform: `rotate(${expanded ? '0' : '180deg' })` }}/>
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