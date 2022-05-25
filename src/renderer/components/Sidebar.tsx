import {Tab, Tabs} from '@mantine/core';
import styles from './Sidebar.module.css';
import * as React from 'react';
import {FileTree} from './filetree/FileTree';
import {Builds} from './Builds';
import {useAppDispatch, useAppSelector} from '../slices/store';
import {SidebarActions} from '../slices/SidebarSlice';

type SidebarProps = {
	width: number;
};

export const Sidebar = ({ width }: SidebarProps) => {
	const dispatch = useAppDispatch();
	const activeTab = useAppSelector(state => state.sidebar.activeTab);

	const handleTabChange = (index: number) => dispatch(SidebarActions.setActiveTab(index === 0 ? 'filetree' : 'logs'));

	return <Tabs
		grow
		variant="pills"
		active={activeTab === 'filetree' ? 0 : 1}
		onTabChange={handleTabChange}
		style={{ width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` }}
		classNames={{ body: styles.tabBody, root: styles.tabRoot }}
	>
		<Tab label="File Tree">
			<FileTree />
		</Tab>
		<Tab label="Builds">
			<Builds />
		</Tab>
	</Tabs>;
};