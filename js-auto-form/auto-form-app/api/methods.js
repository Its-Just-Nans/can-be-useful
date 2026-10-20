const { shell, dialog, clipboard, ipcRenderer, ipcMain } = require("electron");
const process = require("process");
const path = require("path");

const openFileFolder = async (givenPath = "./") => {
    if (!path.isAbsolute(givenPath)) {
        givenPath = path.resolve(givenPath);
    }
    shell.showItemInFolder(givenPath);
};

const openExternal = async (givenPath) => {
    shell.openExternal(givenPath);
};

const makeNotification = async (notification = null) => {
    if (!notification) {
        notification = {
            title: "Basic Notification",
            body: "Short message part",
        };
    }
    const myNotification = new window.Notification(
        notification.title,
        notification
    );

    myNotification.onclick = () => {
        console.log("Notification clicked"); // TODO
    };
};

const makeNotificationWithImage = async (notification = null) => {
    if (!notification) {
        notification = {
            title: "Notification with image",
            body: "Short message plus a custom image",
            icon: path.join(__dirname, "../../../assets/img/programming.png"),
        };
    }
    const myNotification = new window.Notification(
        notification.title,
        notification
    );

    myNotification.onclick = () => {
        console.log("Notification clicked"); //TODO
    };
};

const showOpenDialog = async () => {
    dialog.showOpenDialog(
        {
            properties: ["openFile", "openDirectory"],
        },
        (files) => {
            if (files) {
                event.sender.send("selected-directory", files); // todo
            }
        }
    );
};

const showErrorBox = async () => {
    dialog.showErrorBox("An Error Message", "Demonstrating an error message.");
};

const showMessageBox = async () => {
    const options = {
        type: "info",
        title: "Information",
        message: "This is an information dialog. Isn't it nice?",
        buttons: ["Yes", "No"],
    };
    dialog.showMessageBox(options, (index) => {
        event.sender.send("information-dialog-selection", index); //TODO
    });
};

const showSaveDialog = async () => {
    const options = {
        title: "Save an Image",
        filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
    };
    dialog.showSaveDialog(options, (filename) => {
        event.sender.send("saved-file", filename); // TODO
    });
};

const startDrag = async (req, res) => {
    let a = path.join(__dirname, "..", "main.js");
    if (req && req.body && req.body.filename) {
        a = req.body.filename;
    }
    try {
        ipcMain.emit("ondragstart", a);
        //ipcRenderer.send("ondragstart", a);
    } catch (e) {
        console.log(e);
    }
};

const getAppInfo = async () => {
    const { screen } = require("electron").remote;
    return {
        appPath: app.getAppPath(),
        electronVersion: process.versions.electron,
        homeDir: os.homedir(),
        size: screen.getPrimaryDisplay().size, // workAreaSize //workArea
    };
};

const writeClipboard = async () => {
    clipboard.writeText("Electron Demo!");
};

const readClipboard = async () => {
    clipboard.readText();
};

module.exports = {
    openFileFolder,
    openExternal,
    makeNotification,
    makeNotificationWithImage,
    showOpenDialog,
    showErrorBox,
    startDrag,
};
