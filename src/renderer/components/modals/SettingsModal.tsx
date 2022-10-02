import * as React from 'react';
import {ActionIcon, Button, Container, Group, NumberInput, Space, Stack, TextInput, Title, Checkbox} from '@mantine/core';
import {AiOutlineFolder} from 'react-icons/ai';
import {MainProcess} from '../../MainProcessUtils';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {ContextModalProps} from '@mantine/modals';
import {StorageActions} from '../../slices/StorageSlice';
import {OverlayActions} from '../../slices/OverlaySlice';

export const SettingsModal = ({context, id}: ContextModalProps) => {
	const dispatch = useAppDispatch();
	const gameExePath = useAppSelector(state => state.storage.gamePath);
	const maximumBuildsToKeep = useAppSelector(state => state.storage.maximumBuildsToKeep);
	const saveFilesOnBuild = useAppSelector(state => state.storage.saveFilesOnBuild);

	const handleFolderClicked = async () => {
		dispatch(OverlayActions.show());

		const gamePath = await MainProcess.getGamePath();

		if (gamePath) dispatch(StorageActions.setGamePath(gamePath));

		dispatch(OverlayActions.hide());
	};

	return <Container>
		<Stack>
			<Title order={1}>Settings</Title>
			<TextInput
				required
				label="Game Executable"
				placeholder="C:\path\to\WDC.exe"
				value={gameExePath}
				onChange={e => dispatch(StorageActions.setGamePath(e.target.value))}
				rightSection={<ActionIcon onClick={handleFolderClicked} color="dark"><AiOutlineFolder /></ActionIcon>}
			/>
			<NumberInput
				required
				label="Maximum builds to keep"
				description="(Enter 0 to keep all builds)"
				min={0}
				value={maximumBuildsToKeep}
				onChange={e => dispatch(StorageActions.setMaximumBuildsToKeep(e ?? 0))}
			/>
			<Checkbox
				required
				label="Automatically save all open files on Build"
				checked={saveFilesOnBuild}
				onChange={e => dispatch(StorageActions.setSaveFilesOnBuild(e.currentTarget.checked))}
			/>
			<Space h="xl" />
			<Group position="right">
				<Button color='gray' onClick={() => context.closeModal(id)}>Close</Button>
			</Group>
		</Stack>
	</Container>
};