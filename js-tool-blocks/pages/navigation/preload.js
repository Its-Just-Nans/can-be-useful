const fs = require("fs");
const path = require("path");
const { contextBridge } = require("electron");
const Store = require("electron-store");

const store = new Store();

const start = async () => {
    let allMenu = [];

    const blocksPath = path.join(__dirname, "../blocks");

    let files = fs.readdirSync(blocksPath);
    if (typeof files === "undefined" || files === null) {
        console.error("Unable to scan directory: " + err);
        files = [];
    }
    for (let oneFile of files) {
        let newMenu = {};
        const dirPath = path.join(blocksPath, oneFile);
        if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
            const linkToJSONPkg = path.join(dirPath, "package.json");
            if (fs.existsSync(linkToJSONPkg)) {
                try {
                    const file = fs.readFileSync(linkToJSONPkg);
                    const { block } = JSON.parse(file.toString());
                    newMenu.name = block.menu || oneFile;
                    if (typeof block.preload !== "undefined" && block.preload != "") {
                        newMenu.preload = path.join(dirPath, block.preload) || "";
                    } else {
                        newMenu.preload = "";
                    }
                    if (typeof block.main !== "undefined" && block.main != "") {
                        newMenu.src = path.join(dirPath, block.main) || "index.html";
                    } else {
                        newMenu.src = "index.html";
                    }
                } catch (error) {
                    //error with parsing
                    console.error(error);
                    newMenu.name = oneFile;
                    newMenu.preload = "";
                    newMenu.src = "index.html";
                }
            } else {
                newMenu.name = oneFile; // search in package json
                // looking for preload
                const preloadPath = path.join(dirPath, "preload.js");
                if (fs.existsSync(preloadPath)) {
                    newMenu.preload = preloadPath;
                }
                const src = path.join(dirPath, "index.html");
                if (fs.existsSync(src)) {
                    newMenu.src = src;
                }
            }
        }
        allMenu.push(newMenu);
    }
    const getRandomColor = function () {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const color = getRandomColor();
    contextBridge.exposeInMainWorld("api", {
        getMenus: () => {
            return allMenu;
        },
        getBlock: (preloadPath) => {
            if (preloadPath != "") {
                if (!path.isAbsolute(preloadPath)) {
                    preloadPath = path.join(__dirname, preloadPath);
                }
                try {
                    const preloadBlock = require(preloadPath);
                    return preloadBlock || {};
                } catch (error) {
                    console.error(`Preload fail at ${preloadPath}`);
                    console.error(error);
                    return preloadBlock || {};
                }
            } else {
                return {};
            }
        },
        getBlockData: (name) => {
            if (fs.existsSync(name)) {
                const dataFromBlock = require(name);
                return dataFromBlock || {};
            } else {
                return {};
            }
        },
        getColor: () => {
            return color;
        },
    });
};

store.set('unicorn', 'azerty');
console.log(store.get('unicorn'));

// Use dot-notation to access nested properties
store.set('foo.bar', true);
console.log(store.get('foo'));

start();
