import {EditorFile} from '../../../shared/types';
import * as React from 'react';
import {FileTreeDirectory} from './FileTreeDirectory';
import styles from './FileTree.module.css';

type FileTreeProps = {
	root: EditorFile,
	width: number,
};

export const FileTree = ({ root, width }: FileTreeProps) => {
	return <div className={styles.container} style={{ width: `${width}px` }}>
		<FileTreeDirectory
			directory={root}
			indentation={0}
		/>
	</div>
};
