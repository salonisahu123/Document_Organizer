const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Select Folder
  selectDirectory: () =>
    ipcRenderer.invoke("select-directory"),
});