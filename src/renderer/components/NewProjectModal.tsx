import {ContextModalProps, useModals} from '@mantine/modals';
import * as React from 'react';
import {ActionIcon, Button, Container, Group, NumberInput, Space, Stack, TextInput, Title} from '@mantine/core';
import {AiOutlineFolder} from 'react-icons/ai';
import {useForm} from '@mantine/form';
import {MainProcess} from '../MainProcessUtils';
import {createProject} from '../../shared/types';
import {resetAllSlices, useAppDispatch} from '../slices/store';
import {FileTreeActions} from '../slices/FileTreeSlice';
import {ProjectActions} from '../slices/ProjectSlice';
import {formatProjectName} from '../../shared/utils';

export const NewProjectModal = ({context, id}: ContextModalProps) => {
	const dispatch = useAppDispatch();

	const form = useForm({
		initialValues: {
			projectName: '',
			author: '',
			path: '',
			priority: 950
		}
	});

	const handleSubmit = async ({ path: projectPath, projectName, author, priority }: typeof form.values) => {
		const project = createProject(projectName, '0.0.1', author, priority);

		const { root } = await MainProcess.createProjectDirectory({ projectPath, project });

		resetAllSlices(dispatch);

		dispatch(FileTreeActions.setRootDirectory(root));
		dispatch(ProjectActions.setProject(project));

		context.closeModal(id);
	};

	const handleFolderClicked = async () => {
		const response = await MainProcess.getNewProjectLocation();

		if (!response) return;

		form.setValues(state => ({ ...state, path: response }));
	};

	const projectDescription = form.values.projectName ? `Creating directory "${formatProjectName(form.values.projectName)}"` : '';

	return <Container>
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack>
				<Title order={1}>Create Project</Title>
				<TextInput
					required
					label="Project name:"
					description={projectDescription}
					placeholder="My Awesome Mod"
					{...form.getInputProps('projectName')}
				/>
				<TextInput required label="Author:" placeholder="MeticulousModder96" {...form.getInputProps('author')} />
				<NumberInput required label="Priority:" {...form.getInputProps('priority')} />
				<TextInput
					required
					label="Project location:"
					placeholder="C:\Projects\My_Awesome_Mod"
					{...form.getInputProps('path')}
					rightSection={<ActionIcon onClick={handleFolderClicked} color="dark"><AiOutlineFolder /></ActionIcon>}
				/>
			</Stack>
			<Space h="xl"/>
			<Group position="right">
				<Button color="green" type="submit">Create</Button>
			</Group>
		</form>
	</Container>;
};