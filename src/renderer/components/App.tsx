import * as React from 'react';
import 'react-resizable/css/styles.css';
import 'normalize.css/normalize.css';
import {useEffect, useState} from 'react';
import {EditorFile} from '../../shared/types';
import {NoProjectOpen} from './NoProjectOpen';
import {Project} from './Project';

export const App = () => {
	const [root, setRoot] = useState<EditorFile | null>(null);

	useEffect(() => {
		(window as any).ipc.onMenuOpenProjectClicked(handleOpenProject);
	}, []);

	const handleOpenProject = async () => {
		const fileTree = await (window as any).ipc.openProject();
		if (!fileTree) return;

		setRoot(fileTree);
	};

	return root ? <Project root={root} /> : <NoProjectOpen onOpenProject={handleOpenProject} />
};