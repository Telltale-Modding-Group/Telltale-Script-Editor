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