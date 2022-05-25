import {EditorFile} from '../shared/types';
import {isSupported} from './FileUtils';

export const iterateFiles = (root: EditorFile): EditorFile[] => {
	if (root.directory) {
		return root.children
			.map(child => iterateFiles(child))
			.reduce((acc, descendantGroup) => [...acc, ...descendantGroup], []);
	}

	return isSupported(root) ? [root] : [];
};

export const createDebouncer = () => {
	let timeoutId: number;

	return (fn: () => void, timeout: number) => {
		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			console.log('debounced!');
			fn();
		}, timeout) as unknown as number;
		console.log('setting timeout', timeoutId);
	};
};