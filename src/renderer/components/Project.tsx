import styles from './Project.module.css';
import {EditorContainer} from './editor/EditorContainer';
import * as React from 'react';
import {MutableRefObject, useEffect, useRef, useState} from 'react';
import {resetAllSlices, useAppDispatch, useAppSelector} from '../slices/store';
import {ActionIcon, Button, Code, Group, Header, Modal, ScrollArea, Space, Stack, Text, Title} from '@mantine/core';
import {BsHammer} from 'react-icons/bs';
import {AiOutlineCaretRight} from 'react-icons/ai';
import {MainProcess} from '../MainProcessUtils';
import {ProjectActions} from '../slices/ProjectSlice';
import {Sidebar} from './Sidebar';
import {LogActions} from '../slices/LogSlice';
import {showNotification} from '@mantine/notifications';
import {SidebarActions} from '../slices/SidebarSlice';
import {Navbar} from './Navbar';

const INITIAL_FILETREE_WIDTH = 250;

const useSidebarResizer = (): [number, MutableRefObject<HTMLDivElement | null>] => {
	const [fileTreeWidth, setFileTreeWidth] = useState(INITIAL_FILETREE_WIDTH);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!ref.current) return;

		let mouseDown = false;

		const mouseDownListener = () => {
			document.body.style.userSelect = 'none';
			mouseDown = true;
		};

		const mouseUpListener = () => {
			document.body.style.userSelect = 'initial';
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
	const dispatch = useAppDispatch();

	const root = useAppSelector(state => state.filetree.root);
	const project = useAppSelector(state => state.project.currentProject);

	if (!root || !project) return null;

	const [sidebarWidth, ref] = useSidebarResizer();

	const projectContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const listener = () => {
			if (!ref.current || !projectContainerRef.current) return;

			ref.current.style.height = `${projectContainerRef.current.clientHeight}px`;
		}

		listener();

		document.body.addEventListener('resize', listener);

		return () => document.body.removeEventListener('resize', listener);
	}, [ref.current, projectContainerRef.current]);

	useEffect(() =>
		MainProcess.handleMenuCloseProject(() => {
			resetAllSlices(dispatch);
			MainProcess.updateAppState({ projectOpen: false });
		}),
		[dispatch]
	);

	return <div className={styles.container}>
		<Navbar />
		<div className={styles.filetreeEditorContainer} ref={projectContainerRef}>
			<Sidebar width={sidebarWidth} />

			{/* This effectively hovers over the right border of the file tree to give the user more space to select the
		    border, without requiring a gap between the file tree and the editor container. */}
			<div className={styles.resizeContainer} style={{ left: `${sidebarWidth}px` }} ref={ref}></div>

			<EditorContainer />
		</div>
	</div>;
};
