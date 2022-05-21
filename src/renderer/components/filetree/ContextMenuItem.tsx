import {MenuItem} from '@szhsin/react-menu';
import {Text} from '@mantine/core';
import * as React from 'react';

type ContextMenuItemProps = {
	onClick?: () => void,
	children: string
};

export const ContextMenuItem = ({onClick, children}: ContextMenuItemProps) => <MenuItem onClick={onClick}>
	<Text size="xs">{children}</Text>
</MenuItem>;