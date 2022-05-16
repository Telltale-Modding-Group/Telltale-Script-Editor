import styles from './FileTree.module.css';
import * as React from 'react';
import {Accordion, AccordionItem} from '@mantine/core';
import {EditorFile} from './EditorFile';
import type { EditorFile as EditorFileType } from '../../shared/types';

type FileTreeProps = {
	root: EditorFileType,
	onFileOpened: (file: EditorFileType) => void
};

export const FileTree = ({root, onFileOpened}: FileTreeProps) => {
	const renderFileTree = (file: EditorFileType, index: number, files: EditorFileType[]) => file.directory ? (
		<Accordion multiple key={file.path} classNames={{
			contentInner: styles.contentInner,
			label: styles.label,
			content: styles.content,
			control: styles.button,
			item: `${styles.item} ${index === 0 && styles.firstItem} ${index === files.length - 1 && styles.lastItem}`
		}}>
			<AccordionItem label={file.name}>
				{file.children.map(renderFileTree)}
			</AccordionItem>
		</Accordion>
	) : (
		<EditorFile key={file.path} file={file} onFileClicked={() => onFileOpened(file)}/>
	);

	return <div className={styles.filetree}>
		{renderFileTree(root, 0, [])}
	</div>
};