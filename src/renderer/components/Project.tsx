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

const INITIAL_FILETREE_WIDTH = 300;

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
	const mouseDown = useRef(false);

	useEffect(() => {
		if (!ref.current) return;

		const mouseDownListener = () => {
			mouseDown.current = true;
		};

		const mouseUpListener = () => {
			mouseDown.current = false;
		};

		const moveListener = (event: DocumentEventMap['mousemove']) => {
			if (!mouseDown.current) return;

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
	}, [ref, mouseDown]);

	return <div className={styles.container}>
		<FileTree width={filetreeWidth} root={root} onFileOpened={openFile} />

		{/* TODO: Make file tree width resizable */}
		<div style={{ width: '1px', height: '100%', backgroundColor: 'black' }}></div>
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