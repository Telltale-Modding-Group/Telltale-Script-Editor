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
	const selectedFile = useAppSelector(state => state.filetree.selectedFile);
	const showContextMenu = useAppSelector(state => state.filetree.showContextMenu);
	const expandedDirectories = useAppSelector(state => state.filetree.expandedDirectories);

	if (!root) return null;

	const isDirectory = selectedFile?.directory;
	const path = selectedFile?.path;
	const hasChildren = isDirectory && selectedFile.children.length > 0;
	const expanded = path ? expandedDirectories[path] : undefined;
	const selectedTseprojFile = selectedFile?.name.includes('.tseproj');
	const isRootDirectory = path === root.path;

	const [menuProps, toggleMenu] = useMenuState();

	useEffect(() => {
		if (showContextMenu) {
			toggleMenu(true);
		} else {
			toggleMenu(false);
		}
	}, [showContextMenu]);

	const toggleSelectedDirectory = () => path && dispatch(FileTreeActions.toggleDirectory(path));
	const expandSelectedDirectory = () => path && dispatch(FileTreeActions.expandDirectory(path));

	const handleRefreshRootDirectory = () => {
		dispatch(FileTreeAsyncActions.refreshRootDirectory());
	};

	const handleCreateFile = async () => {
		if (!path) return;

		const newFilePath = await MainProcess.createFile({ directoryPath: path, extension: 'txt' });

		expandSelectedDirectory();
		dispatch(FileTreeActions.setRenamingFilePath(newFilePath));
		handleRefreshRootDirectory();
	};

	const handleCreateScript = async () => {
		if (!path) return;

		const newFilePath = await MainProcess.createFile({ directoryPath: path, extension: 'lua' });

		expandSelectedDirectory();
		dispatch(FileTreeActions.setRenamingFilePath(newFilePath));
		handleRefreshRootDirectory()
	};

	const handleCreateDirectory = async () => {
		if (!path) return;

		const directoryPath = await MainProcess.createDirectory(path);

		expandSelectedDirectory();
		dispatch(FileTreeActions.setRenamingFilePath(directoryPath));
		handleRefreshRootDirectory()
	};

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const hideDeleteModal = () => setShowDeleteModal(false);

	const handleDeleteDirectory = async () => {
		if (!selectedFile) return;

		hideDeleteModal();

		await MainProcess.deleteFile(selectedFile);

		handleRefreshRootDirectory()
		dispatch(EditorActions.handleFileDeleted(selectedFile));
	};

	const handleRename = () => {
		dispatch(FileTreeActions.setRenamingFilePath(selectedFile?.path));
	};

	const handleOpenInExplorer = () => {
		if (!path) return;

		MainProcess.openInExplorer(path);
	};

	const handleDoubleClick = () => {
		if (!selectedFile) return;

		if (!isSupported(selectedFile)) {
			return showNotification({
				title: 'Unable to open file',
				message: `${selectedFile.name} is an unsupported file.`,
				color: 'red'
			});
		}

		dispatch(EditorAsyncActions.openFile(selectedFile));
	}

	const handleDeleteFile = () => {
		setShowDeleteModal(true);
	};

	const handleContextMenuClose = () => {
		toggleMenu(false);
		dispatch(FileTreeActions.setShowContextMenu(false));
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
				<Text>Are you sure you want to delete <em>{selectedFile?.name}</em>?</Text>
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

				{isRootDirectory && <ContextMenuItem onClick={handleRefreshRootDirectory}>Refresh</ContextMenuItem>}
				{hasChildren && <ContextMenuItem onClick={toggleSelectedDirectory}>{expanded ? 'Collapse' : 'Expand'}</ContextMenuItem>}
				{!isDirectory && <ContextMenuItem onClick={handleDoubleClick}>Open in Editor</ContextMenuItem>}
				<ContextMenuItem onClick={handleRename}>Rename</ContextMenuItem>
				<ContextMenuItem onClick={handleOpenInExplorer}>Open in explorer</ContextMenuItem>
				{!selectedTseprojFile && <ContextMenuItem onClick={handleDeleteFile}>Delete</ContextMenuItem>}
			</ControlledMenu>
		</Portal>
	</>;
};