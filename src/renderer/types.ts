import {EditorFile, Project} from '../shared/types';

export type OpenFile = {
	file: EditorFile,
	contents: string,
	hasUnsavedChanges: boolean
};

export type RecentProject = { project: Project, tseprojPath: string };

export type LuaSyntaxError = {
	column: number;
	index: number;
	line: number;
}