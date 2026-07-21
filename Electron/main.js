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



// ==============================

// Read PDF Files

// ==============================

ipcMain.handle("read-pdf-files", async (event, folderPath) => {

    try {

        const files = fs.readdirSync(folderPath);

        const pdfs = files

            .filter(file => file.toLowerCase().endsWith(".pdf"))

            .map(file => ({

                name: file,

                path: path.join(folderPath, file)

            }));

        return pdfs;

    }

    catch (err) {

        console.log(err);

        return [];

    }

});



// ==============================

// PDF Preview

// ==============================

ipcMain.handle("get-pdf-base64", async (event, filePath) => {

    try {

        const file = fs.readFileSync(filePath);

        return file.toString("base64");

    }

    catch (err) {

        console.log(err);

        return null;

    }

});



// ==============================

// Classify PDF

// ==============================

ipcMain.handle("classify-pdf", async (event, data) => {

    try {

        const {

            sourceFile,

            outputFolder,

            category

        } = data;



        const categoryFolder = path.join(

            outputFolder,

            category

        );



        if (!fs.existsSync(categoryFolder)) {

            fs.mkdirSync(categoryFolder, {

                recursive: true

            });

        }



        const fileName = path.basename(sourceFile);



        let destination = path.join(

            categoryFolder,

            fileName

        );



        let count = 1;



        while (fs.existsSync(destination)) {

            const ext = path.extname(fileName);

            const name = path.basename(fileName, ext);



            destination = path.join(

                categoryFolder,

                `${name} (${count})${ext}`

            );



            count++;

        }



        fs.copyFileSync(

            sourceFile,

            destination

        );



        return {

            success: true,

            destination

        };

    }

    catch (err) {

        console.log(err);



        return {

            success: false

        };

    }

});