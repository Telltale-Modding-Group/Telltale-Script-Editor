import styles from './App.module.css';
import {EditorFile as EditorFileType, TestFiles} from '../TestData';
import * as React from 'react';
import {Accordion, AccordionItem} from '@mantine/core';
import {EditorFile} from './EditorFile';

type FileTreeProps = {
	root: EditorFileType,
	onFileOpened: (file: EditorFileType) => void
};

export const FileTree = ({root, onFileOpened}: FileTreeProps) => {
	const renderFileTree = (file: EditorFileType) => file.directory ? (
		<Accordion multiple key={file.path} styles={{ contentInner: { paddingTop: 0, paddingBottom: 0 } }}>
			<AccordionItem label={file.name}>
				{file.children.map(renderFileTree)}
			</AccordionItem>
		</Accordion>
	) : (
		<EditorFile key={file.path} file={file} onFileClicked={() => onFileOpened(file)}/>
	);

	return <div className={styles.filetree}>
		{renderFileTree(root)}
	</div>
};