const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {

  // Select Folder
  selectDirectory: () =>
    ipcRenderer.invoke("select-directory"),

  // Read PDF Files
  readPdfFiles: (folderPath) =>
    ipcRenderer.invoke("read-pdf-files", folderPath),

  // PDF Preview
  getPdfBase64: (filePath) =>
    ipcRenderer.invoke("get-pdf-base64", filePath),

  // Copy PDF to Category
  classifyPdf: (data) =>
    ipcRenderer.invoke("classify-pdf", data)

});