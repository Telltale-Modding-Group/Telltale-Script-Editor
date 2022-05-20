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
	formatVersion: '1',
	tool: {
		game: 'TTDS'
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
		game: 'TTDS'
	},
	mod: {
		name,
		version,
		author,
		priority
	}
});