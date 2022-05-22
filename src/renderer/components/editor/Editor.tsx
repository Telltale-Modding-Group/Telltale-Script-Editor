import {useAppDispatch, useAppSelector} from '../../slices/store';
import {EditorActions} from '../../slices/EditorSlice';
import AceEditor from 'react-ace';
import * as React from 'react';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-lua';
import 'ace-builds/src-noconflict/mode-json';

type EditorProps = {
	onChange?: (change: string) => void
	mode?: 'lua' | 'json'
};

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

	return <AceEditor
		enableBasicAutocompletion
		enableLiveAutocompletion
		mode={mode ?? 'lua'}
		theme="monokai"
		height="100%"
		width="100%"
		onChange={handleEditorChange}
		value={activeFile.contents}
	/>;
};