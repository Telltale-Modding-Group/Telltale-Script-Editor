import styles from './App.module.css';
import {FileTree} from './FileTree';
import {EditorContainer} from './EditorContainer';
import * as React from 'react';
import {EditorFile} from '../../shared/types';
import {readAllLines} from '../FileUtils';
import {useState} from 'react';
import {OpenFile} from '../types';

type ProjectProps = {
	root: EditorFile
};

export const Project = ({ root }: ProjectProps) => {
	const [openFiles, setOpenFiles] = useState<OpenFile[]>([])
	const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);

	const openFile = async (file: EditorFile) => {
		if (openFiles.some(openFile => openFile.file.path === file.path)) return;

		const contents = await readAllLines(file.path);
		setOpenFiles([...openFiles, { file, contents, unsaved: false }]);
		setActiveFileIndex(openFiles.length);
	};

	const updateActiveFileContents = (newContents: string) => {
		const updatedFile = openFiles[activeFileIndex as number];
		updatedFile.contents = newContents;
		updatedFile.unsaved = true;

		setOpenFiles([...openFiles]);
	};

	const handleSaveFile = async (index = activeFileIndex) => {
		const openFile = openFiles[activeFileIndex!];
		const { file, contents, unsaved } = openFile;

		if (!unsaved) return;

		await (window as any).ipc.saveFile(file.path, contents);

		openFile.unsaved = false;

		setOpenFiles([...openFiles]);
	};

	const handleTabClose = async (index: number, saveChanges: boolean) => {
		if (saveChanges) {
			const openFile = openFiles[index];

			await (window as any).ipc.saveFile(openFile.file.path, openFile.contents);
		}

		openFiles.splice(index, 1)
		const newOpenFiles = [...openFiles];

		if (activeFileIndex! + 1 > newOpenFiles.length) {
			if (activeFileIndex! - 1 < 0) {
				setActiveFileIndex(null);
			} else {
				setActiveFileIndex(activeFileIndex! - 1);
			}
		}

		setOpenFiles(newOpenFiles);
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
			closeTab={handleTabClose}
			saveActiveFile={handleSaveFile}
		/>
	</div>;
};