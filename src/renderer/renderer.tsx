/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import * as React from 'react';
import {createRoot, Root} from 'react-dom/client';
import {App} from './components/App';
import {NotificationsProvider} from '@mantine/notifications';
import {Provider} from 'react-redux';
import {store} from './slices/store';
import {ModalsProvider} from '@mantine/modals';
import {NewProjectModal} from './components/modals/NewProjectModal';
import {AboutModal} from './components/modals/AboutModal';
import {SettingsModal} from './components/modals/SettingsModal';
import {MantineProvider} from "@mantine/core";

const container = document.querySelector('#app');

let selectedTheme = 'light';

// TODO: Replace with a better type, if possible?
const themes: {[key: string]: [(string | undefined), (string | undefined), (string | undefined), (string | undefined), (string | undefined), (string | undefined), (string | undefined), (string | undefined), (string | undefined), (string | undefined)] | undefined} = {
	// No Time Left
	"dark": [
		'#C1C2C5',
		'#A6A7AB',
		'#909296',
		'#5C5F66',
		'#373A40',
		'#2C2E33',
		'#25262B',
		'#1A1B1E',
		'#141517',
		'#101113'
	],
	// All That Remains
	"darkAlt": [
		'#F8F9FA',
		'#F1F3F5',
		'#E9ECEF',
		'#DEE2E6',
		'#CED4DA',
		'#ADB5BD',
		'#868E96',
		'#495057',
		'#343A40',
		'#212529'
	],
	// A House Divided
	"midnight": [
		'#d5d7e0',
		'#acaebf',
		'#8c8fa3',
		'#666980',
		'#4d4f66',
		'#34354a',
		'#2b2c3d',
		'#1d1e30',
		'#0c0d21',
		'#01010a'
	]
};

const getProviders = () => {
	return <React.StrictMode>
		<Provider store={store}>
			<MantineProvider theme={{ colorScheme: selectedTheme === 'light' ? 'light' : 'dark', colors: { dark: themes[selectedTheme === 'light' ? 'dark' : selectedTheme] /* If using 'light', 'dark' colors are not changed */ }}} withGlobalStyles withNormalizeCSS>
				<NotificationsProvider>
					<ModalsProvider modalProps={{ overlayColor: selectedTheme === 'light' ? 'light' : 'dark' }} modals={{ newproject: NewProjectModal, about: AboutModal, settings: SettingsModal }}>
						<App />
					</ModalsProvider>
				</NotificationsProvider>
			</MantineProvider>
		</Provider>
	</React.StrictMode>;
}

const renderRoot = (root: Root) => root.render(getProviders());

if (!container) throw new Error('Element with ID "app" not found! Unable to start application!');

const root = createRoot(container);

renderRoot(root);

export const setSelectedTheme = (theme: string) => {
	selectedTheme = theme;
	renderRoot(root);
}