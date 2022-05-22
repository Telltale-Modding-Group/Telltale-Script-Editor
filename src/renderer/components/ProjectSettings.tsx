import * as React from 'react';
import {Accordion, AccordionItem, Container, NumberInput, Space, Stack, Switch, TextInput} from '@mantine/core';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {ProjectActions} from '../slices/ProjectSlice';
import {useEffect} from 'react';
import {EditorActions} from '../slices/EditorSlice';

export const ProjectSettings = () => {
	const dispatch = useAppDispatch();

	const project = useAppSelector(state => state.project.currentProject);

	if (!project) return null;

	const mod = project.mod;

	useEffect(() => {
		dispatch(EditorActions.setActiveFileContents(JSON.stringify(project, null, 2)));
	}, [project]);

	return <Container size={900}>
		<Stack>
			<TextInput label="Name:" value={mod.name} onChange={e => dispatch(ProjectActions.setModName(e.target.value))} />
			<TextInput label="Version:" value={mod.version} onChange={e => dispatch(ProjectActions.setModVersion(e.target.value))} />
			<TextInput label="Author:" value={mod.author} onChange={e => dispatch(ProjectActions.setModAuthor(e.target.value))} />
			<NumberInput label="Priority:" value={mod.priority} onChange={value => value && dispatch(ProjectActions.setModPriority(value))} />

			<Accordion>
				<AccordionItem label="Advanced" styles={{ content: { padding: 0 }, contentInner: { padding: 0 }, item: { borderBottom: 'none' } }}>
					<TextInput label="Format Version:" value={project.formatVersion} onChange={e => dispatch(ProjectActions.setFormatVersion(e.target.value))} />
					<Space h="xl" />
					<Switch label="Use legacy build" checked={project.tool.legacyBuild} onChange={e => dispatch(ProjectActions.setLegacyBuild(e.currentTarget.checked))} />
				</AccordionItem>
			</Accordion>
		</Stack>
	</Container>;
};