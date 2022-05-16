import {EditorFile} from '../shared/types';

export type OpenFile = {
	file: EditorFile,
	contents: string,
	unsaved: boolean
};