// preload.js  (replace any `import` lines with these)
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// expose only what you need to the renderer
contextBridge.exposeInMainWorld('journalAPI', {
  ping: () => 'pong',
  // example FS bridge (optional)
  // saveEntry: (plaintext, iso) => { ... }
});
