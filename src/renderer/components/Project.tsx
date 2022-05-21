import styles from './Project.module.css';
import {EditorContainer} from './editor/EditorContainer';
import * as React from 'react';
import {MutableRefObject, useEffect, useRef, useState} from 'react';
import { FileTree } from './filetree/FileTree';
import {useAppSelector} from '../slices/store';
import {ActionIcon, Button, Code, Group, Header, Modal, ScrollArea, Space, Stack, Text, Title} from '@mantine/core';
import {BsHammer} from 'react-icons/bs';
import {AiOutlineCaretRight} from 'react-icons/ai';
import {MainProcess} from '../MainProcessUtils';

const INITIAL_FILETREE_WIDTH = 250;

const useFileTreeResizer = (): [number, MutableRefObject<HTMLDivElement | null>] => {
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
	const root = useAppSelector(state => state.filetree.root);
	const project = useAppSelector(state => state.project.currentProject)!;

	if (!root) return null;

	const [fileTreeWidth, ref] = useFileTreeResizer();

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

	const [showBuildModal, setShowBuildModal] = useState(false);
	const [building, setBuilding] = useState(false);
	const [output, setOutput] = useState('');

	useEffect(() =>
		MainProcess.handleBuildProjectLog(log => setOutput(output => output + '\n' + log)),
		[setOutput]
	);

	const handleBuildProject = async () => {
		setShowBuildModal(true);
		setBuilding(true);
		await MainProcess.buildProject({ projectPath: root.path, project });
		setBuilding(false);
	};

	useEffect(() =>
		MainProcess.handleMenuBuildProject(handleBuildProject),
		[root.path, project]
	);

	return <div className={styles.container}>
		<Modal opened={showBuildModal} withCloseButton={false} onClose={() => setShowBuildModal(false)} size="lg" styles={{ modal: { height: '90%' }, body: { height: '100%' }}}>
			<Stack style={{ height: '100%' }}>
				<Title order={3}>{building ? 'Building project...' : 'Project built!'}</Title>

				<Text>Log:</Text>
				<Code block style={{ height: '100%', display: 'flex', overflow: 'auto', flexDirection: 'column-reverse' }}>
					{output}
				</Code>

				<Space h="xl" />

				<Group position="right">
					<Button disabled={building} color='gray' onClick={() => setShowBuildModal(false)}>Close</Button>
				</Group>
			</Stack>
		</Modal>
		<div className={styles.navbarContainer}>
			<div className={styles.navbarButtonsContainer}>
				<ActionIcon color='green' onClick={handleBuildProject}>
					<BsHammer />
				</ActionIcon>
				<ActionIcon color='green'>
					<AiOutlineCaretRight />
				</ActionIcon>
			</div>
		</div>
		<div className={styles.filetreeEditorContainer} ref={projectContainerRef}>
			<FileTree root={root} width={fileTreeWidth} />

			{/* This effectively hovers over the right border of the file tree to give the user more space to select the
		    border, without requiring a gap between the file tree and the editor container. */}
			<div className={styles.resizeContainer} style={{ left: `${fileTreeWidth}px` }} ref={ref}></div>

			<EditorContainer />
		</div>
	</div>;
};
