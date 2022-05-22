import * as React from 'react';
import {ActionIcon, Button, Container, Group, Space, Stack, TextInput, Title} from '@mantine/core';
import {AiOutlineFolder} from 'react-icons/ai';
import {MainProcess} from '../../MainProcessUtils';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {ContextModalProps} from '@mantine/modals';
import {LocalStoreActions} from '../../slices/LocalStoreSlice';
import {useState} from 'react';

export const SettingsModal = ({context, id}: ContextModalProps) => {
	const dispatch = useAppDispatch();
	const gameExePath = useAppSelector(state => state.localstore.gamePath);

	const handleFolderClicked = async () => {
		let gamePath = gameExePath;

		if (!gamePath) {
			gamePath = await MainProcess.getGamePath();

			if (!gamePath) return;

			dispatch(LocalStoreActions.setGamePath(gamePath));
		}
	};

	return <Container>
		<Stack>
			<Title order={1}>Settings</Title>
			<TextInput
				required
				label="Game Executable:"
				placeholder="C:\path\to\WDC.exe"
				value={gameExePath}
				onChange={e => dispatch(LocalStoreActions.setGamePath(e.target.value))}
				rightSection={<ActionIcon onClick={handleFolderClicked} color="dark"><AiOutlineFolder /></ActionIcon>}
			/>
			<Space h="xl" />
			<Group position="right">
				<Button color='gray' onClick={() => context.closeModal(id)}>Close</Button>
			</Group>
		</Stack>
	</Container>
};