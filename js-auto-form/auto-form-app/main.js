// require('update-electron-app')({
//   logger: require('electron-log')
// })
// need an external repository

const path = require("path");
const process = require("process");
const { app, BrowserWindow, ipcMain } = require("electron");

process.on("uncaughtException", (err, origin) => {
    console.error("Uncaught Exception origin ->", origin);
    console.error("Uncaught Exception err ->", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled rejection promise ->", promise);
    console.error("Unhandled rejection reason  ->", reason);
});

const server = require("./api/server");

app.setName("Auto-form");

let mainWindow = null;

function initialize() {
    makeSingleInstance();

    function createWindow() {
        const windowOptions = {
            width: 1080,
            minWidth: 680,
            height: 840,
            title: app.getName(),
            webPreferences: {
                contextIsolation: true,
            },
        };

        if (process.platform === "linux") {
            windowOptions.icon = path.join(
                __dirname,
                "assets",
                "app-icon",
                "png",
                "1024.png"
            );
        }

        mainWindow = new BrowserWindow(windowOptions);
        const finalPath = path.join(
            "file://",
            __dirname,
            "public",
            "/index.html"
        );
        mainWindow.loadURL(finalPath);

        mainWindow.on("closed", () => {
            mainWindow = null;
        });
    }

    app.on("ready", () => {
        createWindow();
        ipcMain.on("ondragstart", (event, filePath = event) => {
            const ico = path.join(
                __dirname,
                "assets",
                "app-icon",
                "png",
                "16.png"
            );
            mainWindow.webContents.startDrag({
                file: filePath,
                icon: ico,
            });
        });
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("activate", () => {
        if (mainWindow === null) {
            createWindow();
        }
    });
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
    if (process.mas) {
        return;
    }
    app.requestSingleInstanceLock();

    app.on("second-instance", () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });
}

initialize();
