import {useAppDispatch, useAppSelector} from '../../slices/store';
import {EditorActions} from '../../slices/EditorSlice';
import * as React from 'react';
import MonacoEditor, {loader} from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

type EditorProps = {
	onChange?: (change: string) => void
	mode?: 'lua' | 'json'
};

loader.config({ monaco });

export const Editor = ({ onChange, mode }: EditorProps) => {
	const dispatch = useAppDispatch();

	const activeFileIndex = useAppSelector(state => state.editor.activeFileIndex);
	const openFiles = useAppSelector(state => state.editor.openFiles);

	const activeFile = activeFileIndex !== undefined ? openFiles[activeFileIndex] : undefined;

	if (!activeFile) return null;

	const handleEditorChange = (contents: string) => {
		dispatch(EditorActions.setActiveFileContents(contents));
		onChange?.(contents);
	};

	return <div style={{ height: '100%', width: '100%' }}>
		<MonacoEditor
			defaultLanguage={mode}
			defaultValue={activeFile.contents}
			theme="vs-dark"
			onChange={contents => handleEditorChange(contents!)}
		/>
	</div>;
};