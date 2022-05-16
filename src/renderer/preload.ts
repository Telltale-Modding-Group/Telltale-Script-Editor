const { contextBridge, ipcRenderer } = require('electron');

// TODO: Figure out a better way of using this type-safely; renderer just assumes window.ipc exists
//       and hopes for the best.
contextBridge.exposeInMainWorld('ipc',{
	openProject: () => ipcRenderer.invoke('openproject'),
	onMenuOpenProjectClicked: (handler: () => void) => ipcRenderer.on('menu:openproject', handler),
	getFileContents: (path: string) => ipcRenderer.invoke('getfilecontents', path),
	saveFile: (path: string, newContents: string) => ipcRenderer.invoke('savefile', path, newContents)
});