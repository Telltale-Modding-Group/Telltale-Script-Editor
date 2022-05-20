import {BrowserWindow, Menu, shell} from 'electron';
import {getIPCMainChannelSource} from './utils';
import {
	MenuNewProjectChannel,
	MenuNotImplementedChannel,
	MenuOpenProjectChannel,
	MenuProjectSettingsChannel
} from '../shared/Channels';

export const getEditorMenu = (window: BrowserWindow) => {
	const source = getIPCMainChannelSource(window);

	// TODO: Remove once everything is good to go
	const notImplemented = () => MenuNotImplementedChannel(source).send();

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
							label: 'Script',
							click: notImplemented
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
							label: 'TTARCH2 Archive',
							click: notImplemented
						}
					]
				},
				{
					label: 'Save',
					click: notImplemented
				},
				{
					label: 'Save As',
					click: notImplemented
				},
				{
					label: 'Reload',
					click: () => window.reload()
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
					label: 'Build',
					click: notImplemented
				},
				{
					label: 'Build and Run',
					click: notImplemented
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
					label: 'About',
					click: notImplemented
				},
				{
					label: 'Contribute',
					click: () => shell.openExternal('https://github.com/Telltale-Modding-Group/Telltale-Script-Editor')
				},
				{
					label: 'Debug',
					submenu: [
						{
							label: 'Verbose Output',
							click: notImplemented
						},
						{
							label: 'Show Project Info',
							click: notImplemented
						}
					]
				}
			]
		}
	]);
}