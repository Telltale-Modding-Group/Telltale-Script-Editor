import styles from './EditorContainer.module.css';
import {Center, Tab, Tabs, Text} from '@mantine/core';
import AceEditor from 'react-ace';
import * as React from 'react';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-lua';
import {useEffect} from 'react';
import {EditorTab} from './EditorTab';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {EditorActions, EditorAsyncActions} from '../slices/EditorSlice';

export const EditorContainer = () => {
	const dispatch = useAppDispatch();

	const activeFileIndex = useAppSelector(state => state.editor.activeFileIndex);
	const openFiles = useAppSelector(state => state.editor.openFiles);

	const activeFile = activeFileIndex !== undefined ? openFiles[activeFileIndex] : undefined;

	useEffect(() => {
		const listener = (event: DocumentEventMap['keydown']) => {
			if (event.key === 's' && event.ctrlKey && activeFileIndex) {
				dispatch(EditorAsyncActions.saveFile(activeFileIndex))
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

	const handleEditorChange = (contents: string) => {
		dispatch(EditorActions.setActiveFileContents(contents));
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
					<Tab key={openFile.file.path} icon={<EditorTab file={openFile} index={index} />}>
						<AceEditor
							enableBasicAutocompletion
							enableLiveAutocompletion
							mode="lua"
							theme="monokai"
							height="100%"
							width="100%"
							onChange={handleEditorChange}
							value={activeFile!.contents}
						/>
					</Tab>
				))}
			</Tabs>
		}
	</div>
};