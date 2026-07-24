const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const path = require("path");

const fs = require("fs");

function createWindow() {

    const win = new BrowserWindow({

        width: 1600,

        height: 900,

        webPreferences: {

            preload: path.join(__dirname, "preload.js"),

            contextIsolation: true,

            nodeIntegration: false

        }

    });

    win.loadURL("http://localhost:5173");

}

app.whenReady().then(() => {

    createWindow();

});





// ==============================

// Select Folder

// ==============================

ipcMain.handle("select-directory", async () => {

    const result = await dialog.showOpenDialog({

        properties: ["openDirectory"]

    });

    if (result.canceled) {

        return null;

    }

    return result.filePaths[0];

});



