import * as React from 'react';
import 'react-resizable/css/styles.css';
import 'normalize.css/normalize.css';
import {useState} from 'react';
import type {EditorFile as EditorFileType} from '../TestData';
import {readAllLines} from '../FileUtils';
import styles from './App.module.css';
import {OpenFile} from '../types';
import {EditorContainer} from './EditorContainer';
import {FileTree} from './FileTree';

type AppProps = {
	root: EditorFileType
};

export const App = ({ root }: AppProps) => {
	const [openFiles, setOpenFiles] = useState<OpenFile[]>([])
	const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);

	const openFile = (file: EditorFileType) => {
		if (openFiles.some(openFile => openFile.file.path === file.path)) return;

		const contents = readAllLines(file.path);
		setOpenFiles([...openFiles, { file, contents, unsaved: false }]);
		setActiveFileIndex(openFiles.length);
	};

	const updateActiveFileContents = (newContents: string) => {
		const updatedFile = openFiles[activeFileIndex as number];
		updatedFile.contents = newContents;
		updatedFile.unsaved = true;

		setOpenFiles([...openFiles]);
	};

	return <div className={styles.container}>
		<FileTree root={root} onFileOpened={openFile} />

		{/* TODO: Make file tree width resizable */}
		<div style={{ width: '1px', cursor: 'col-resize', display: 'flex', justifyContent: 'center' }}>
			<div style={{ width: '1px', height: '100%', backgroundColor: 'black' }}></div>
		</div>

		<EditorContainer
			openFiles={openFiles}
			activeFileIndex={activeFileIndex}
			onTabChange={setActiveFileIndex}
			updateActiveFileContents={updateActiveFileContents}
		/>
	</div>
};