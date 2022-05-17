import styles from './FileTree.module.css';
import * as React from 'react';
import {Accordion, AccordionItem} from '@mantine/core';
import {EditorFile} from './EditorFile';
import type { EditorFile as EditorFileType } from '../../shared/types';
import {FileTreeLabel} from './FileTreeLabel';

type FileTreeProps = {
	width: number,
	root: EditorFileType,
	onFileOpened: (file: EditorFileType) => void
};

export const FileTree = ({width, root, onFileOpened}: FileTreeProps) => {
	const renderFileTree = (file: EditorFileType) => file.directory ? (
		<Accordion multiple key={file.path} classNames={{
			contentInner: styles.contentInner,
			content: styles.content,
			control: styles.button,
			item: `${styles.item}`,
			icon: styles.dropdownIcon
		}}>
			<AccordionItem label={<FileTreeLabel file={file} />}>
				{file.children.map(renderFileTree)}
			</AccordionItem>
		</Accordion>
	) : (
		<EditorFile key={file.path} file={file} onFileClicked={() => onFileOpened(file)}/>
	);

	return <div className={styles.filetree} style={{ width }}>
		{renderFileTree(root)}
	</div>
};