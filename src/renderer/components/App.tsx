import * as React from 'react';
import 'react-resizable/css/styles.css';
import 'normalize.css/normalize.css';
import {useState} from 'react';
import {EditorFile} from '../../shared/types';
import {NoProjectOpen} from './NoProjectOpen';
import {Project} from './Project';
import {MainProcess} from '../MainProcessUtils';

export const App = () => {
	const [root, setRoot] = useState<EditorFile | null>(null);

	// TODO: Reimplement
	// useEffect(() => {
	// 	IPC.onMenuOpenProjectClicked(handleOpenProject);
	// }, []);

	const handleOpenProject = async () => {
		const fileTree = await MainProcess.openProject();
		if (!fileTree) return;

		// console.log(JSON.stringify(fileTree));

		setRoot(fileTree);
	};

	return root ? <Project root={root} /> : <NoProjectOpen onOpenProject={handleOpenProject} />
};
