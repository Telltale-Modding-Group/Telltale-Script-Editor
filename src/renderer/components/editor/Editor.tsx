import {useAppDispatch, useAppSelector} from '../../slices/store';
import {EditorActions} from '../../slices/EditorSlice';
import * as React from 'react';
import MonacoEditor, {loader} from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import {useEffect, useRef} from 'react';
import {createDebouncer} from '../../utils';
import * as parser from 'luaparse';
import styles from './Editor.module.css';
import {LuaSyntaxError} from "../../types";

type EditorProps = {
	onChange?: (change: string) => void
	mode?: 'lua' | 'json',
};

loader.config({ monaco });

let decorations: string[] = [];

const debounce = createDebouncer();
export const Editor = ({ onChange, mode }: EditorProps) => {
	const dispatch = useAppDispatch();

	const activeFileIndex = useAppSelector(state => state.editor.activeFileIndex);
	const openFiles = useAppSelector(state => state.editor.openFiles);
	const sidebarWidth = useAppSelector(state => state.storage.sidebarWidth);
	const syntaxErrorLineNumber = useAppSelector(state => state.editor.syntaxErrorLineNumber);

	const activeFile = activeFileIndex !== undefined ? openFiles[activeFileIndex] : undefined;

	if (!activeFile) return null;

	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
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

		if (mode === 'lua') debounce(() => checkLuaSyntax(contents), 1250);

		onChange?.(contents);
	};

	const checkLuaSyntax = (contents: string) => {
		if (!editorRef.current) return;

		try {
			parser.parse(contents);

			if (decorations.length > 0) {
				editorRef.current?.deltaDecorations(decorations, []);
				decorations = [];
			}
		} catch (e) {
			const syntaxError = e as LuaSyntaxError;

			decorations = editorRef.current?.deltaDecorations(
				decorations,
				[
					{
						range: new monaco.Range(syntaxError.line, 1, syntaxError.line, 1),
						options: {
							glyphMarginClassName: styles.syntaxError
						}
					}
				]
			);
		}
	}

	const handleMount = (monaco: monaco.editor.IStandaloneCodeEditor) => {
		editorRef.current = monaco;

		if (mode === 'lua') checkLuaSyntax(editorRef.current?.getValue());

		if (syntaxErrorLineNumber) {
			editorRef.current?.revealLine(syntaxErrorLineNumber, 0);
			dispatch(EditorActions.setSyntaxErrorLineNumber());
		}
	}

	return <MonacoEditor
		defaultLanguage={mode}
		defaultValue={activeFile.contents}
		theme="vs-dark"
		options={{ glyphMargin: true }}
		onChange={contents => handleEditorChange(contents!)}
		onMount={monaco => handleMount(monaco)}
	/>
};