import styles from './App.module.css';
import {FileTree} from './FileTree';
import {EditorContainer} from './EditorContainer';
import * as React from 'react';
import {EditorFile} from '../../shared/types';
import {readAllLines} from '../FileUtils';
import {useEffect, useRef, useState} from 'react';
import {OpenFile} from '../types';

type ProjectProps = {
	root: EditorFile
};

const INITIAL_FILETREE_WIDTH = 250;

export const Project = ({ root }: ProjectProps) => {
	const [openFiles, setOpenFiles] = useState<OpenFile[]>([])
	const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
	const [filetreeWidth, setFiletreeWidth] = useState(INITIAL_FILETREE_WIDTH);

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

	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!ref.current) return;

		let mouseDown = false;

		const mouseDownListener = () => {
			mouseDown = true;
		};

		const mouseUpListener = () => {
			mouseDown = false;
		};

		const moveListener = (event: DocumentEventMap['mousemove']) => {
			if (!mouseDown) return;

			setFiletreeWidth(Math.max(INITIAL_FILETREE_WIDTH, Math.round(event.clientX)));
		};

		ref.current.addEventListener('mousedown', mouseDownListener);
		document.addEventListener('mouseup', mouseUpListener);
		document.addEventListener('mousemove', moveListener);

		return () => {
			ref.current?.removeEventListener('mousedown', mouseDownListener);
			document.removeEventListener('mouseup', mouseUpListener);
			document.removeEventListener('mousemove', moveListener);
		};
	}, [ref]);

	return <div className={styles.container}>
		<FileTree width={filetreeWidth} root={root} onFileOpened={openFile} />

		{/* This effectively hovers over the right border of the file tree to give the user more space to select the
		    border, without requiring a gap between the file tree and the editor container. */}
		<div className={styles.resizeContainer} style={{ left: `${filetreeWidth}px` }} ref={ref}></div>

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