import styles from './EditorContainer.module.css';
import {Center, Tab, Tabs, Text} from '@mantine/core';
import * as React from 'react';
import {useEffect} from 'react';
import {EditorTab} from './EditorTab';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {EditorActions, EditorAsyncActions} from '../../slices/EditorSlice';
import {ProjectSettings} from '../ProjectSettings';
import {ProjectActions} from '../../slices/ProjectSlice';
import {Editor} from './Editor';
import {useBuildProject} from "../../hooks";

export const EditorContainer = () => {
	const dispatch = useAppDispatch();
	const { buildProject, buildProjectAndRun } = useBuildProject();

	const activeFileIndex = useAppSelector(state => state.editor.activeFileIndex);
	const openFiles = useAppSelector(state => state.editor.openFiles);

	const activeFile = activeFileIndex !== undefined ? openFiles[activeFileIndex] : undefined;

	useEffect(() => {
		const listener = (event: DocumentEventMap['keydown']) => {
			if (event.key === 's' && event.ctrlKey && activeFileIndex !== undefined) {
				dispatch(EditorAsyncActions.saveFile(activeFileIndex))
			// .toLowerCase() needed as 'B' will be returned if holding Shift
			} else if (event.key.toLowerCase() === 'b' && event.ctrlKey) {
				if (event.shiftKey) {
					void buildProjectAndRun();
				} else {
					void buildProject();
				}
			}
		};

		document.addEventListener('keydown', listener);

		return () => {
			document.removeEventListener('keydown', listener);
		}
	}, [activeFile]);

	const handleTabChange = (newIndex: number) => {
		dispatch(EditorActions.setActiveFileIndex(newIndex));
	};

	const handleProjectSettingsJSONChange = (content: string) => {
		// TODO: This assumes the content is valid JSON AND a valid project, add checks
		dispatch(ProjectActions.setProject(JSON.parse(content)));
	};

	return <div className={styles.editorContainer}>
		{ openFiles.length === 0
			? <Center style={{ height: '100%' }}>
				<Text className={styles.noFileOpenMessage}>Select a file to start editing...</Text>
			</Center>
			: <Tabs
				active={activeFileIndex}
				classNames={{ root: styles.tabsContainer, body: styles.tabBody, tabControl: styles.tabControl }}
				onTabChange={handleTabChange}
			>
				{openFiles.map((openFile, index) => (
					<Tab key={openFile.file.path} icon={<EditorTab openFile={openFile} index={index} />}>
						{openFile.file.name.includes('.tseproj')
							? <Tabs variant="pills" color="blue" grow  classNames={{ root: styles.tabsContainer, body: styles.tabBody }}>
								<Tab label="Visual Editor">
									<ProjectSettings />
								</Tab>
								<Tab label="JSON Editor">
									<Editor mode="json" onChange={handleProjectSettingsJSONChange} />
								</Tab>
							</Tabs>
							: <Editor mode="lua" />
						}

					</Tab>
				))}
			</Tabs>
		}
	</div>
};