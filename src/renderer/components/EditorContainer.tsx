import styles from './EditorContainer.module.css';
import {Center, Tab, Tabs, Text} from '@mantine/core';
import AceEditor from 'react-ace';
import * as React from 'react';
import {OpenFile} from '../types';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-lua';
import {useMemo} from 'react';

type EditorContainerProps = {
	openFiles: OpenFile[],
	activeFileIndex: number | null,
	onTabChange: (newIndex: number) => void,
	updateActiveFileContents: (newContents: string) => void
};

export const EditorContainer = ({ openFiles, activeFileIndex, onTabChange, updateActiveFileContents }: EditorContainerProps) => {
	const activeFile = useMemo(() => activeFileIndex !== null ? openFiles[activeFileIndex] : null, [openFiles, activeFileIndex]);

	return <div className={styles.editorContainer}>
		{ activeFileIndex === null
			? <Center style={{ height: '100%' }}>
				<Text className={styles.noFileOpenMessage}>Select a file to start editing...</Text>
			</Center>
			: <Tabs
				active={activeFileIndex}
				classNames={{ root: styles.tabsContainer, body: styles.tabBody }}
				onTabChange={onTabChange}
			>
				{openFiles.map(({ file, unsaved }) => (
					<Tab key={file.path} label={`${file.name} ${unsaved ? '(*)' : ''}`}>
						<AceEditor
							mode="lua"
							theme="monokai"
							height="100%"
							width="100%"
							onChange={updateActiveFileContents}
							value={activeFile!.contents}
						/>
					</Tab>
				))}
			</Tabs>
		}
	</div>
};