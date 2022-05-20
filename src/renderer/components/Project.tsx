import styles from './App.module.css';
import {EditorContainer} from './editor/EditorContainer';
import * as React from 'react';
import {MutableRefObject, useEffect, useRef, useState} from 'react';
import { FileTree } from './filetree/FileTree';
import {useAppSelector} from '../slices/store';
import {EditorFile} from '../../shared/types';

const INITIAL_FILETREE_WIDTH = 250;

const useFileTreeResizer = (): [number, MutableRefObject<HTMLDivElement | null>] => {
	const [fileTreeWidth, setFileTreeWidth] = useState(INITIAL_FILETREE_WIDTH);
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

			setFileTreeWidth(Math.max(INITIAL_FILETREE_WIDTH, Math.round(event.clientX)));
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

	return [fileTreeWidth, ref];
};

export const Project = () => {
	const root = useAppSelector(state => state.filetree.root);

	const [fileTreeWidth, ref] = useFileTreeResizer();

	return <div className={styles.container}>
		<FileTree root={root as EditorFile} width={fileTreeWidth} />

		{/* This effectively hovers over the right border of the file tree to give the user more space to select the
		    border, without requiring a gap between the file tree and the editor container. */}
		<div className={styles.resizeContainer} style={{ left: `${fileTreeWidth}px` }} ref={ref}></div>

		<EditorContainer />
	</div>;
};
