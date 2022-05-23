import { store } from '../renderer/slices/store';

export type EditorFile = {
	directory: false,
	name: string,
	path: string
} | {
	directory: true,
	name: string,
	path: string,
	children: EditorFile[]
};

export type Project = {
	formatVersion: string,
	tool: {
		game: 'TTDS',
		legacyBuild: boolean
	},
	mod: {
		name: string,
		version: string,
		author: string,
		priority: number
	}
};

export const createProject = (name: string, version: string, author: string, priority: number): Project => ({
	formatVersion: '1',
	tool: {
		game: 'TTDS',
		legacyBuild: true
	},
	mod: {
		name,
		version,
		author,
		priority
	}
});

export const getDefaultProject = () => createProject('ProjectName', '0.0.1', 'ProjectAuthor', 950);

type ModInfo = {
	ModDisplayName: string,
	ModVersion: string,
	ModAuthor: string,
	ModCompatibility: 'The_Walking_Dead_Definitive_Edition',
	ModFiles: string[]
};

export const createModInfo = (name: string, version: string, author: string, files: string[]): ModInfo => ({
	ModDisplayName: name,
	ModVersion: version,
	ModAuthor: author,
	ModCompatibility: 'The_Walking_Dead_Definitive_Edition',
	ModFiles: files
});

export type AppState = ReturnType<typeof store.getState>;
