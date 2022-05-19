import styles from './App.module.css';
import {EditorContainer} from './EditorContainer';
import * as React from 'react';
import {EditorFile} from '../../shared/types';
import {useEffect, useRef, useState} from 'react';
import { FileTree } from './filetree/FileTree';

type ProjectProps = {
	root: EditorFile
};

const INITIAL_FILETREE_WIDTH = 250;

export const Project = ({ root }: ProjectProps) => {
	const [filetreeWidth, setFiletreeWidth] = useState(INITIAL_FILETREE_WIDTH);

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
		<FileTree root={root} width={filetreeWidth} />

		{/* This effectively hovers over the right border of the file tree to give the user more space to select the
		    border, without requiring a gap between the file tree and the editor container. */}
		<div className={styles.resizeContainer} style={{ left: `${filetreeWidth}px` }} ref={ref}></div>

		<EditorContainer />
	</div>;
};
