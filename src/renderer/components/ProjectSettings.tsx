import * as React from 'react';
import {Container, NumberInput, Stack, TextInput} from '@mantine/core';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {ProjectActions} from '../slices/ProjectSlice';
import {useEffect} from 'react';
import {EditorActions} from '../slices/EditorSlice';

export const ProjectSettings = () => {
	const dispatch = useAppDispatch();

	const project = useAppSelector(state => state.project.currentProject);
	const mod = project!.mod;

	useEffect(() => {
		dispatch(EditorActions.setActiveFileContents(JSON.stringify(project, null, 2)));
	}, [project]);

	return <Container size={900}><Stack>
		<TextInput label="Name:" value={mod.name} onChange={e => dispatch(ProjectActions.setModName(e.target.value))} />
		<TextInput label="Version:" value={mod.version} onChange={e => dispatch(ProjectActions.setModVersion(e.target.value))} />
		<TextInput label="Author:" value={mod.author} onChange={e => dispatch(ProjectActions.setModAuthor(e.target.value))} />
		<NumberInput label="Priority:" value={mod.priority} onChange={value => dispatch(ProjectActions.setModPriority(value!))} />
	</Stack></Container>
};