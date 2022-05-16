import styles from './EditorContainer.module.css';
import {Button, Center, Group, Modal, Space, Stack, Tab, Tabs, Text, Title} from '@mantine/core';
import AceEditor from 'react-ace';
import * as React from 'react';
import {OpenFile} from '../types';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-lua';
import {useEffect, useMemo, useState} from 'react';
import {EditorTab} from './EditorTab';

type EditorContainerProps = {
	openFiles: OpenFile[],
	activeFileIndex: number | null,
	onTabChange: (newIndex: number) => void,
	closeTab: (index: number, saveChanges: boolean) => void,
	updateActiveFileContents: (newContents: string) => void,
	saveActiveFile: () => void
};

export const EditorContainer = ({ openFiles, activeFileIndex, onTabChange, updateActiveFileContents, closeTab, saveActiveFile }: EditorContainerProps) => {
	const activeFile = useMemo(() => activeFileIndex !== null ? openFiles[activeFileIndex] : null, [openFiles, activeFileIndex]);

	if (activeFile === undefined) {
		console.log('active file is undefined!', { activeFile, openFiles, activeFileIndex });
	}

	const [tabIndexToClose, setTabIndexToClose] = useState<number | null>(null);
	const showModal = useMemo(() => tabIndexToClose !== null, [tabIndexToClose]);

	useEffect(() => {
		const listener = (event: DocumentEventMap['keydown']) => {
			if (event.key === 's' && event.ctrlKey) {
				saveActiveFile();
			}
		};

		document.addEventListener('keydown', listener);

		return () => {
			document.removeEventListener('keydown', listener);
		}
	}, [saveActiveFile]);

	const handleCloseClicked = (unsaved: boolean, index: number) => {
		if (!unsaved) return closeTab(index, false);

		setTabIndexToClose(index);
	};

	const hideModal = () => setTabIndexToClose(null);

	return <div className={styles.editorContainer}>
		<Modal
			centered
			withCloseButton={false}
			opened={showModal}
			onClose={() => setTabIndexToClose(null)}
		>
			<Stack>
				<Title order={2}>Unsaved Changes</Title>
				<Text>Do you want to save changes before closing?</Text>
				<Space h="md" />
				<Group position="right" spacing="xs">
					<Button color="green" onClick={() => {
						closeTab(tabIndexToClose!, true);
						hideModal();
					}}>
						Save
					</Button>
					<Button color="red" onClick={() => {
						closeTab(tabIndexToClose!, false);
						hideModal();
					}}>
						Discard
					</Button>
					<Button color="gray" onClick={() => setTabIndexToClose(null)}>Cancel</Button>
				</Group>
			</Stack>
		</Modal>

		{ activeFileIndex === null
			? <Center style={{ height: '100%' }}>
				<Text className={styles.noFileOpenMessage}>Select a file to start editing...</Text>
			</Center>
			: <Tabs
				active={activeFileIndex}
				classNames={{ root: styles.tabsContainer, body: styles.tabBody, tabControl: styles.tabControl }}
				onTabChange={onTabChange}
			>
				{openFiles.map(({ file, unsaved }, index) => (
					<Tab key={file.path} icon={<EditorTab file={file} unsaved={unsaved} onTabClosed={() => handleCloseClicked(unsaved, index)} />}>
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