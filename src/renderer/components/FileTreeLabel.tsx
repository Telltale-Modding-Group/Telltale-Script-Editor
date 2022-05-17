import {AiOutlineFolder} from 'react-icons/ai';
import {Text} from '@mantine/core';
import * as React from 'react';
import {EditorFile} from '../../shared/types';
import styles from './FileTreeLabel.module.css';

type FileTreeLabelProps = {
	file: EditorFile
};

export const FileTreeLabel = ({ file }: FileTreeLabelProps) => <div className={styles.container}>
	<AiOutlineFolder style={{ minWidth: '20px' }}/>
	<Text className={styles.label}>{file.name}</Text>
</div>;