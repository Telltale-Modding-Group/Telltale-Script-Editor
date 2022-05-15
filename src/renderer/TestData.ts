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

const directory = (name: string, children: EditorFile[] = []): EditorFile => ({
	directory: true,
	name,
	path: name,
	children
});

const file = (name: string): EditorFile => ({
	directory: false,
	name,
	path: name
});

export const TestFiles = directory('project', [
	file('test.lua'),
	file('anothertest.lua'),
	directory('utils', [
		file('utils.lua'),
		file('regex.lua')
	]),
	file('archive.zip')
]);
