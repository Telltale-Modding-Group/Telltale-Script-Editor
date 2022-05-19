import {Dir} from 'fs';
import {EditorFile} from '../shared/types';
import path from 'path';
import {opendir} from 'fs/promises';

export const getFiles = async (root: Dir): Promise<EditorFile> => {
	const children: Array<EditorFile> = [];

	for await (const dirent of root) {
		if (dirent.isFile()) {
			children.push({
				directory: false,
				name: dirent.name,
				path: path.join(root.path, dirent.name)
			});
		} else {
			children.push(await getFiles(await opendir(path.join(root.path, dirent.name))));
		}
	}

	return {
		directory: true,
		name: path.basename(root.path),
		path: root.path,
		children
	};
};