import {EditorFile} from '../../shared/types';
import {AiOutlineClose} from 'react-icons/ai';
import * as React from 'react';
import styles from './EditorTab.module.css';

type EditorTabProps = {
	file: EditorFile,
	unsaved: boolean,
	onTabClosed: () => void
};

export const EditorTab = ({ file, unsaved, onTabClosed }: EditorTabProps) => <div className={styles.container}>
	<span className={styles.label}>{file.name} {unsaved ? '(*)' : ''}</span>
	<div onClick={onTabClosed} className={styles.closeButton}><AiOutlineClose /></div>
</div>