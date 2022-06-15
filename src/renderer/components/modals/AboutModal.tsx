import {Container, Stack, Title, Text} from '@mantine/core';
import * as React from 'react';

export const AboutModal = () => {
	return <Container>
		<Stack align="center">
			<Title order={1}>Telltale Script Editor</Title>
			<Text>Version 2.1.1</Text>
		</Stack>
	</Container>
};