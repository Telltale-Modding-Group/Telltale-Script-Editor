import {ControlledMenu, SubMenu, useMenuState} from '@szhsin/react-menu';
import {Button, Group, Modal, Portal, Space, Stack, Text, Title} from '@mantine/core';
import {ContextMenuItem} from './ContextMenuItem';
import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {useEffect, useState} from 'react';
import {FileTreeActions, FileTreeAsyncActions} from '../../slices/FileTreeSlice';
import {MainProcess} from '../../MainProcessUtils';
import {EditorActions, EditorAsyncActions} from '../../slices/EditorSlice';
import {showNotification} from '@mantine/notifications';
import {isSupported} from '../../FileUtils';

export const FileTreeContextMenu = () => {
	const dispatch = useAppDispatch();
	const root = useAppSelector(state => state.filetree.root);
	const anchorPoint = useAppSelector(state => state.filetree.contextMenuAnchorPoint);
	const contextMenuFile = useAppSelector(state => state.filetree.contextMenuFile);
	const expandedDirectories = useAppSelector(state => state.filetree.expandedDirectories);

	if (!root) return null;

	const isDirectory = contextMenuFile?.directory;
	const path = contextMenuFile?.path;
	const hasChildren = contextMenuFile?.directory && contextMenuFile.children.length > 0;
	const expanded = path ? expandedDirectories[path] : undefined;
	const selectedTseprojFile = contextMenuFile?.name.includes('.tseproj');

	const [menuProps, toggleMenu] = useMenuState();

	useEffect(() => {
		if (contextMenuFile) {
			toggleMenu(true);
		} else {
			toggleMenu(false);
		}
	}, [contextMenuFile]);

	const toggleSelectedDirectory = () => dispatch(FileTreeActions.toggleDirectory(path!));
	const expandSelectedDirectory = () => dispatch(FileTreeActions.expandDirectory(path!));

	const handleCreateFile = async () => {
		if (!path) return;

		const newFilePath = await MainProcess.createFile({ directoryPath: path, extension: 'txt' });

		expandSelectedDirectory();
		dispatch(FileTreeActions.setRenamingFilePath(newFilePath));
		dispatch(FileTreeAsyncActions.refreshRootDirectory());
	};

	const handleCreateScript = async () => {
		if (!path) return;

		const newFilePath = await MainProcess.createFile({ directoryPath: path, extension: 'lua' });

		expandSelectedDirectory();
		dispatch(FileTreeActions.setRenamingFilePath(newFilePath));
		dispatch(FileTreeAsyncActions.refreshRootDirectory());
	};

	const handleCreateDirectory = async () => {
		if (!path) return;

		const directoryPath = await MainProcess.createDirectory(path);

		expandSelectedDirectory();
		dispatch(FileTreeActions.setRenamingFilePath(directoryPath));
		dispatch(FileTreeAsyncActions.refreshRootDirectory());
	};

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const hideDeleteModal = () => setShowDeleteModal(false);

	const handleDeleteDirectory = async () => {
		if (!contextMenuFile) return;

		hideDeleteModal();

		await MainProcess.deleteFile(contextMenuFile);

		dispatch(FileTreeAsyncActions.refreshRootDirectory());
		dispatch(EditorActions.handleFileDeleted(contextMenuFile));
	};

	const handleRename = () => {
		dispatch(FileTreeActions.setRenamingFilePath(contextMenuFile?.path));
	};

	const handleOpenInExplorer = () => {
		if (!path) return;

		MainProcess.openInExplorer(path);
	};

	const handleDoubleClick = () => {
		if (!contextMenuFile) return;

		if (!isSupported(contextMenuFile)) {
			return showNotification({
				title: 'Unable to open file',
				message: `${contextMenuFile.name} is an unsupported file.`,
				color: 'red'
			});
		}

		dispatch(EditorAsyncActions.openFile(contextMenuFile));
	}

	const handleDeleteFile = () => {
		setShowDeleteModal(true);
	};

	const handleContextMenuClose = () => {
		toggleMenu(false);
		dispatch(FileTreeActions.setContextMenuFile());
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
				<Title order={2}>Delete { isDirectory ? 'Directory' : 'File' }</Title>
				<Text>Are you sure you want to delete <em>{contextMenuFile?.name}</em>?</Text>
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
				anchorPoint={anchorPoint}
				onClose={handleContextMenuClose}
				{...menuProps}
			>
				{isDirectory &&
                    <SubMenu label={() => <Text size="xs">New</Text>}>
                        <ContextMenuItem onClick={handleCreateDirectory}>Directory</ContextMenuItem>
                        <ContextMenuItem onClick={handleCreateFile}>Script</ContextMenuItem>
                        <ContextMenuItem onClick={handleCreateScript}>File</ContextMenuItem>
                    </SubMenu>
				}

				{hasChildren && <ContextMenuItem onClick={toggleSelectedDirectory}>{expanded ? 'Collapse' : 'Expand'}</ContextMenuItem>}
				{!isDirectory && <ContextMenuItem onClick={handleDoubleClick}>Open</ContextMenuItem>}
				<ContextMenuItem onClick={handleRename}>Rename</ContextMenuItem>
				<ContextMenuItem onClick={handleOpenInExplorer}>Open in explorer</ContextMenuItem>
				{!selectedTseprojFile && <ContextMenuItem onClick={handleDeleteFile}>Delete</ContextMenuItem>}
			</ControlledMenu>
		</Portal>
	</>;
};