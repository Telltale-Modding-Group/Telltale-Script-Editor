// TODO: Make this actually read filesystem
import {EditorFile} from './TestData';

export const readAllLines = (path: string): string => {
	return `file contents of ${path}`;
}

export const SUPPORTED_FILE_TYPES = ['.lua'];

export const getFileExtension = (file: EditorFile): string => /.*(\.[\da-zA-Z]+)$/g.exec(file.name)![1]