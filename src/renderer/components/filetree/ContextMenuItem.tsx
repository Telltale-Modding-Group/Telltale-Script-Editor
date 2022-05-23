import {MenuItem} from '@szhsin/react-menu';
import {Center, Space, Text} from '@mantine/core';
import * as React from 'react';
import {IconType} from 'react-icons/lib/cjs/iconBase';

type ContextMenuItemProps = {
	onClick?: () => void,
	icon: IconType,
	children: string,
	color?: string
};

export const ContextMenuItem = ({onClick, icon, color, children}: ContextMenuItemProps) => <MenuItem onClick={onClick}>
	<Text size="xs" color={color}>
		<Center inline>
			{/* icon is passed in as a pointer to a functional component; need to call it first to get the JSX element */}
			{icon({})}
			<Space w="xs" />
			{children}
		</Center>
	</Text>
</MenuItem>;