import {BrowserWindow, Menu, shell} from 'electron';
import {getIPCMainChannelSource} from './utils';
import {MenuNewProjectChannel, MenuOpenProjectChannel, MenuProjectSettingsChannel} from '../shared/Channels';

export const getEditorMenu = (window: BrowserWindow) => {
	const source = getIPCMainChannelSource(window);

	return Menu.buildFromTemplate([
		{
			label: 'File',
			submenu: [
				{
					label: 'New',
					submenu: [
						{
							label: 'Project',
							click: () => MenuNewProjectChannel(source).send()
						},
						{
							label: 'Script'
						}
					]
				},
				{
					label: 'Open',
					submenu: [
						{
							label: 'Project',
							click: () => MenuOpenProjectChannel(source).send()
						},
						{
							label: 'TTARCH2 Archive'
						}
					]
				},
				{
					label: 'Save'
				},
				{
					label: 'Save As'
				},
				{
					label: 'Exit',
					click: () => window.close()
				}
			]
		},
		{
			role: 'editMenu'
		},
		{
			label: 'Project',
			submenu: [
				{
					label: 'Build'
				},
				{
					label: 'Build and Run'
				},
				{
					label: 'Project Settings',
					click: () => MenuProjectSettingsChannel(source).send()
				}
			]
		},
		{
			label: 'Help',
			submenu: [
				{
					label: 'Docs',
					click: () => shell.openExternal('https://github.com/Telltale-Modding-Group/Telltale-Script-Editor/wiki')
				},
				{
					label: 'About'
				},
				{
					label: 'Contribute',
					click: () => shell.openExternal('https://github.com/Telltale-Modding-Group/Telltale-Script-Editor')
				},
				{
					label: 'Debug',
					submenu: [
						{
							label: 'Verbose Output'
						},
						{
							label: 'Show Project Info'
						}
					]
				}
			]
		}
	]);
}