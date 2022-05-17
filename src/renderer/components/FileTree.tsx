import styles from './FileTree.module.css';
import * as React from 'react';
import {Accordion, AccordionItem, Text} from '@mantine/core';
import {EditorFile} from './EditorFile';
import type { EditorFile as EditorFileType } from '../../shared/types';
import {AiOutlineFolder} from 'react-icons/ai';

type FileTreeProps = {
	width: number,
	root: EditorFileType,
	onFileOpened: (file: EditorFileType) => void
};

export const FileTree = ({width, root, onFileOpened}: FileTreeProps) => {
	const renderFileTree = (file: EditorFileType, index: number, files: EditorFileType[]) => file.directory ? (
		<Accordion multiple key={file.path} classNames={{
			contentInner: styles.contentInner,
			content: styles.content,
			control: styles.button,
			item: `${styles.item} ${index === 0 && styles.firstItem} ${index === files.length - 1 && styles.lastItem}`,
			icon: styles.dropdownIcon
		}}>
			<AccordionItem label={<div style={{ display: 'flex', alignItems: 'center' }}><AiOutlineFolder style={{ minWidth: '20px' }}/><Text className={styles.label}>{file.name}</Text></div>}>
				{file.children.map(renderFileTree)}
			</AccordionItem>
		</Accordion>
	) : (
		<EditorFile key={file.path} file={file} onFileClicked={() => onFileOpened(file)}/>
	);

	return <div className={styles.filetree} style={{ width }}>
		{renderFileTree(root, 0, [])}
	</div>
};