import * as React from 'react';
import 'react-resizable/css/styles.css';
import 'normalize.css/normalize.css';
import {NoProjectOpen} from './NoProjectOpen';
import {Project} from './Project';
import { useAppSelector } from '../slices/store';

export const App = () => {
	const root = useAppSelector(state => state.filetree.root);

	return root ? <Project root={root} /> : <NoProjectOpen />;
};
