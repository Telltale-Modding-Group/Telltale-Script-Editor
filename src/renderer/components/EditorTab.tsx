import {AiOutlineClose} from 'react-icons/ai';
import * as React from 'react';
import styles from './EditorTab.module.css';
import {OpenFile} from '../types';
import {useAppDispatch} from '../slices/store';
import {EditorActions, EditorAsyncActions} from '../slices/EditorSlice';
import {MouseEventHandler, useState} from 'react';
import {Button, Group, Modal, Space, Stack, Title, Text} from '@mantine/core';

type EditorTabProps = {
	file: OpenFile,
	index: number
};

export const EditorTab = ({ file, index }: EditorTabProps) => {
	const dispatch = useAppDispatch();

	const [showModal, setShowModal] = useState(false);

	const hideModal = () => setShowModal(false);

	const handleClose: MouseEventHandler<HTMLDivElement> = e => {
		e.stopPropagation();

		if (!file.hasUnsavedChanges) return dispatch(EditorActions.closeFile(index));
		setShowModal(true);
	};

	const handleDiscardChanges = () => {
		dispatch(EditorActions.closeFile(index));
		hideModal();
	};

	const handleSaveChanges = () => {
		dispatch(EditorAsyncActions.saveFileAndClose(index));
		hideModal();
	};

	return <>
		<Modal
			centered
			withCloseButton={false}
			opened={showModal}
			onClose={hideModal}
		>
			<Stack>
				<Title order={2}>Unsaved Changes</Title>
				<Text>Do you want to save changes before closing?</Text>
				<Space h="md" />
				<Group position="right" spacing="xs">
					<Button color="gray" onClick={hideModal}>Cancel</Button>
					<Button color="red" onClick={handleDiscardChanges}>
						Discard
					</Button>
					<Button color="green" onClick={handleSaveChanges}>
						Save
					</Button>
				</Group>
			</Stack>
		</Modal>
		<div className={styles.container}>
			<span className={styles.label}>{file.file.name} {file.hasUnsavedChanges ? '(*)' : ''}</span>
			<div onClick={handleClose} className={styles.closeButton}><AiOutlineClose /></div>
		</div>
	</>;
};