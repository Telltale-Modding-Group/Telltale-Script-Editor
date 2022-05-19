import {BrowserWindow, Menu, shell} from 'electron';

export const getEditorMenu = (window: BrowserWindow) => Menu.buildFromTemplate([
	{
		label: 'File',
		submenu: [
			{
				label: 'New',
				submenu: [
					{
						label: 'Project'
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
						click: () => window.webContents.send('menu:openproject')
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