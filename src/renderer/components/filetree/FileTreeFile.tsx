import {Text, TextInput} from '@mantine/core';
import * as React from 'react';
import {EditorFile} from '../../../shared/types';
import styles from './FileTreeFile.module.css';
import classNames from 'classnames';
import {isSupported} from '../../FileUtils';
import {useAppDispatch, useAppSelector} from '../../slices/store';
import {FileTreeActions, FileTreeAsyncActions} from '../../slices/FileTreeSlice';
import {EditorActions, EditorAsyncActions} from '../../slices/EditorSlice';
import {showNotification} from '@mantine/notifications';
import {MouseEventHandler, useState} from 'react';
import {MainProcess} from '../../MainProcessUtils';
import {AiFillSetting, AiOutlineFileZip} from 'react-icons/ai';
import {BsFillFileEarmarkMusicFill} from 'react-icons/bs';
import {SiLua} from 'react-icons/si';

type FileTreeFileProps = {
	file: EditorFile,
	indentation: number
};

export const FileTreeFile = ({file, indentation}: FileTreeFileProps) => {
	const dispatch = useAppDispatch();

	const selectedFile = useAppSelector(state => state.filetree.selectedFile);
	const selected = selectedFile?.path === file.path;
	const supported = isSupported(file);
	const renamingFilePath = useAppSelector(state => state.filetree.renamingFilePath);

	const renaming = renamingFilePath === file.path;

	const handleClick = () => dispatch(FileTreeActions.setSelectedFile(file));
	const handleDoubleClick = () => {
		if (!supported) {
			return showNotification({
				title: 'Unable to open file',
				message: `${file.name} is an unsupported file.`,
				color: 'red'
			});
		}

		dispatch(EditorAsyncActions.openFile(file));
	}

	const [newFileName, setNewFileName] = useState(file.name);

	const handleRenameSubmit = async () => {
		if (newFileName.endsWith('.tseproj')) return showNotification({
			title: 'Unable to rename',
			message: 'There can only be one .tseproj file in this project!',
			color: 'red'
		});

		dispatch(FileTreeActions.setRenamingFilePath());

		if (newFileName !== file.name) {
			const newPath = await MainProcess.renameFile({ file, newName: newFileName });

			dispatch(FileTreeAsyncActions.refreshRootDirectory())
			dispatch(EditorActions.handleRename({ oldPath: file.path, newPath }));
		}
	};

	const handleRightClick: MouseEventHandler<HTMLDivElement> = e => {
		handleClick();
		dispatch(FileTreeActions.setContextMenuAnchorPoint({ x: e.clientX, y: e.clientY}));
		dispatch(FileTreeActions.setShowContextMenu(true));
	};

	let icon;
	const iconProps = {
		className: classNames(styles.icon, {[styles.unsupported]: !supported})
	};

	if (file.name.endsWith('.zip')) {
		icon = <AiOutlineFileZip {...iconProps} />;
	} else if (file.name.endsWith('.lua')) {
		icon = <SiLua {...iconProps} />;
	} else if (['.mp3', '.wav'].some(extension => file.name.endsWith(extension))) {
		icon = <BsFillFileEarmarkMusicFill {...iconProps} />;
	} else if (file.name.endsWith('.tseproj')) {
		icon = <AiFillSetting {...iconProps} />
	}

	return <>
		<div
			className={classNames({[styles.selected]: selected})}
			style={{paddingLeft: `${indentation + 1.4}rem`, display: 'flex', alignItems: 'center'}}
			onClick={handleClick}
			onDoubleClick={handleDoubleClick}
			onContextMenu={handleRightClick}
		>
			{ icon }
			{ renaming
				// Using a form here SOLELY to make it easier to listen for enter pressed
				? <form onSubmit={e => { e.preventDefault(); handleRenameSubmit(); } } style={{ width: '100%' }}>
					<TextInput
						autoFocus
						value={newFileName}
						onChange={e => setNewFileName(e.target.value)}
						size="xs"
						styles={{ root: { width: '100%' } }}
						onBlur={handleRenameSubmit}
					/>
				</form>
				: <Text className={classNames(styles.text, {[styles.unsupported]: !supported})}>
					{file.name}
				</Text>
			}
		</div>
	</>
};