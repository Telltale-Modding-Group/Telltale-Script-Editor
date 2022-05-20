import * as React from 'react';
import 'react-resizable/css/styles.css';
import 'normalize.css/normalize.css';
import {NoProjectOpen} from './NoProjectOpen';
import {Project} from './Project';
import { useAppSelector } from '../slices/store';
import {useDocumentTitle} from '@mantine/hooks';

export const App = () => {
	const root = useAppSelector(state => state.filetree.root);
	const projectDetails = useAppSelector(state => state.project.currentProject?.mod);

	const title = `Telltale Script Editor${projectDetails ? ` - ${projectDetails.name} v${projectDetails.version} by ${projectDetails.author}` : ''}`;
	useDocumentTitle(title);

	return root ? <Project root={root} /> : <NoProjectOpen />;
};
