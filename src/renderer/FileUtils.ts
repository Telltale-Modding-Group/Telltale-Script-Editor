import {EditorFile} from '../shared/types';

export const readAllLines = (path: string): Promise<string> => {
	return (window as any).ipc.getFileContents(path);
}

export const SUPPORTED_FILE_TYPES = ['.lua', '.tseproj'];

export const getFileExtension = (file: EditorFile): string => /.*(\.[\da-zA-Z]+)$/g.exec(file.name)![1]