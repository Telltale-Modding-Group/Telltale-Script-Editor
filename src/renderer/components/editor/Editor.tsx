import {useAppDispatch, useAppSelector} from '../../slices/store';
import {EditorActions} from '../../slices/EditorSlice';
import * as React from 'react';
import MonacoEditor, {loader} from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import {useEffect, useRef} from 'react';
import {createDebouncer} from '../../utils';

type EditorProps = {
	onChange?: (change: string) => void
	mode?: 'lua' | 'json',
};

loader.config({ monaco });

const debounce = createDebouncer();
export const Editor = ({ onChange, mode }: EditorProps) => {
	const dispatch = useAppDispatch();

	const activeFileIndex = useAppSelector(state => state.editor.activeFileIndex);
	const openFiles = useAppSelector(state => state.editor.openFiles);
	const sidebarWidth = useAppSelector(state => state.storage.sidebarWidth);

	const activeFile = activeFileIndex !== undefined ? openFiles[activeFileIndex] : undefined;

	if (!activeFile) return null;

	const editorRef = useRef<monaco.editor.IEditor>();
	useEffect(() => {
		const listener = () => {
			if (!editorRef.current) return;

			debounce(() => {
				editorRef.current?.layout({ width: 0, height: 0 });
				editorRef.current?.layout();
			}, 250);
		};

		window.addEventListener('resize', listener);

		return () => window.removeEventListener('resize', listener);
	}, [editorRef.current]);

	useEffect(() => {
		console.log('sidebar width changed');

		debounce(() => {
			console.log('layout');
			editorRef.current?.layout({ width: 0, height: 0 });
			editorRef.current?.layout();
		}, 250);
	}, [sidebarWidth]);

	const handleEditorChange = (contents: string) => {
		dispatch(EditorActions.setActiveFileContents(contents));
		onChange?.(contents);
	};

	return <MonacoEditor
		defaultLanguage={mode}
		defaultValue={activeFile.contents}
		theme="vs-dark"
		onChange={contents => handleEditorChange(contents as string)}
		onMount={monaco => editorRef.current = monaco}
	/>
};