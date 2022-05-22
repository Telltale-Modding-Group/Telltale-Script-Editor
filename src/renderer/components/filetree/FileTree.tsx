import * as React from 'react';
import {FileTreeDirectory} from './FileTreeDirectory';
import styles from './FileTree.module.css';
import {useAppSelector} from '../../slices/store';
import {FileTreeContextMenu} from './FileTreeContextMenu';

export const FileTree = () => {
	const root = useAppSelector(state => state.filetree.root);

	if (!root) return null;

	return <div className={styles.container}>
		<FileTreeContextMenu />

		<FileTreeDirectory
			directory={root}
			indentation={0}
		/>
	</div>
};
