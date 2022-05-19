import {EditorFile} from '../shared/types';
import {MainProcess} from './MainProcessUtils';

export const readAllLines = (path: string): Promise<string> => {
	return MainProcess.getFileContents(path);
}

export const SUPPORTED_FILE_TYPES = new Set([
	'.lua',
	'.tseproj'
]);

export const getFileExtension = (file: EditorFile): string => /.*(\.[\da-zA-Z]+)$/g.exec(file.name)![1]

export const isSupported = (file: EditorFile): boolean => SUPPORTED_FILE_TYPES.has(getFileExtension(file));