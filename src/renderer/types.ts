import {EditorFile} from './TestData';

export type OpenFile = {
	file: EditorFile,
	contents: string,
	unsaved: boolean
};