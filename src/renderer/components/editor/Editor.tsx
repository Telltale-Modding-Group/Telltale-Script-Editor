import {useAppDispatch, useAppSelector} from '../../slices/store';
import {EditorActions} from '../../slices/EditorSlice';
import AceEditor from 'react-ace';
import * as React from 'react';

type EditorProps = {
	onChange?: (change: string) => void
};
export const Editor = ({onChange}: EditorProps) => {
	const dispatch = useAppDispatch();

	const activeFileIndex = useAppSelector(state => state.editor.activeFileIndex);
	const openFiles = useAppSelector(state => state.editor.openFiles);

	const activeFile = activeFileIndex !== undefined ? openFiles[activeFileIndex] : undefined;

	const handleEditorChange = (contents: string) => {
		dispatch(EditorActions.setActiveFileContents(contents));
		onChange?.(contents);
	};

	return <AceEditor
		enableBasicAutocompletion
		enableLiveAutocompletion
		mode="lua"
		theme="monokai"
		height="100%"
		width="100%"
		onChange={handleEditorChange}
		value={activeFile!.contents}
	/>;
};