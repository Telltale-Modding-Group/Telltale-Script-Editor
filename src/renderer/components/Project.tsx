import styles from './Project.module.css';
import {EditorContainer} from './editor/EditorContainer';
import * as React from 'react';
import {MutableRefObject, useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {Sidebar} from './Sidebar';
import {Navbar} from './Navbar';
import {StorageActions} from '../slices/StorageSlice';
import {useSpotlight} from '@mantine/spotlight';
import * as monaco from 'monaco-editor';
import {createDebouncer} from '../utils';

const useSidebarResizer = (): [number, MutableRefObject<HTMLDivElement | null>] => {
	const dispatch = useAppDispatch();
	const width = useAppSelector(state => state.storage.sidebarWidth);
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

			dispatch(StorageActions.setSidebarWidth(event.clientX));
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

	return [width, ref];
};

const debounce = createDebouncer();

export const Project = () => {
	const root = useAppSelector(state => state.filetree.root);
	const project = useAppSelector(state => state.project.currentProject);
	const spotlight = useSpotlight();

	if (!root || !project) return null;

	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
	const [sidebarWidth, ref] = useSidebarResizer();

	const projectContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const listener = () => {
			if (ref.current && projectContainerRef.current) {
				ref.current.style.height = `${projectContainerRef.current.clientHeight}px`;
			}
		}

		listener();

		window.addEventListener('resize', listener);

		return () => window.removeEventListener('resize', listener);
	}, [ref.current, projectContainerRef.current, editorRef.current]);

	useEffect(() => {
		if (editorRef.current) {
			// I would have thought this would cause the editor to resize to 0px by 0px, but uh, it just resizes to
			// its parent, I guess?
			debounce(() => {
				editorRef.current?.layout({ width: 0, height: 0 });
				editorRef.current?.layout();
			}, 100);

		}
	}, [sidebarWidth]);

	useEffect(() => {
		const listener = (event: DocumentEventMap['keydown']) => {
			if (event.ctrlKey && event.key === 'A') {
				spotlight.openSpotlight();
			}
		};

		document.addEventListener('keydown', listener);

		return () => document.removeEventListener('keydown', listener)
	}, [spotlight]);

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
