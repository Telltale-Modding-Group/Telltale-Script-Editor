import * as React from 'react';
import type { EditorFile as EditorFileType } from '../TestData';
import styles from './EditorFile.module.css';
import {getFileExtension, SUPPORTED_FILE_TYPES} from '../FileUtils';
import {useMemo} from 'react';
import {showNotification} from '@mantine/notifications';

type EditorFileProps = {
	file: EditorFileType,
	onFileClicked: (file: EditorFileType) => void
};

export const EditorFile = ({ file, onFileClicked }: EditorFileProps) => {
	const isSupported = useMemo(() => SUPPORTED_FILE_TYPES.includes(getFileExtension(file)), [file]);
	const handleClick = () => {
		if (isSupported) {
			onFileClicked(file);
		} else {
			showNotification({
				title: 'Unable to open',
				message: `${file.name} is an unsupported file.`,
				color: 'red'
			});
		}
	}

	return <button className={`${styles.file} ${!isSupported && styles.unsupportedFile}`} onClick={handleClick}>{file.name}</button>;
}