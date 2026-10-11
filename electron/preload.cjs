const { contextBridge } = require('electron');
// Deliberately expose no filesystem, shell, process, or arbitrary IPC APIs to the renderer.
contextBridge.exposeInMainWorld('jassApp', Object.freeze({
  productName: 'JASS Privacy Compass',
  version: '1.0.0',
  platform: process.platform
}));
