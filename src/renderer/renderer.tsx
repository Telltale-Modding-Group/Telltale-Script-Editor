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
import {createRoot} from 'react-dom/client';
import {App} from './components/App';
import {NotificationsProvider} from '@mantine/notifications';
import {Provider} from 'react-redux';
import {store} from './slices/store';
import {ModalsProvider} from '@mantine/modals';
import {NewProjectModal} from './components/modals/NewProjectModal';
import {AboutModal} from './components/modals/AboutModal';

const container = document.querySelector('#app');

if (!container) throw new Error('Element with ID "app" not found! Unable to start application!');

createRoot(container).render(
	<React.StrictMode>
		<Provider store={store}>
			<NotificationsProvider>
				<ModalsProvider modals={{ newproject: NewProjectModal, about: AboutModal }}>
					<App />
				</ModalsProvider>
			</NotificationsProvider>
		</Provider>
	</React.StrictMode>
);