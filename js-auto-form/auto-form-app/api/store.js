const path = require("path");
const fs = require("fs");
const { randomBytes } = require("crypto");
const process = require("process");
const bcrypt = require("bcrypt");

const fileName = "auto-form-config.json";
let userDataPath =
    process.env.APPDATA ||
    (process.platform == "darwin"
        ? process.env.HOME + "/Library/Preferences"
        : process.env.HOME + "/.local/share");
if (process.env.DEVMODE) {
    userDataPath = path.join(__dirname, "..", "..");
}

class Store {
    constructor() {
        this.path = path.join(userDataPath, fileName);
        this.data = parseDataFile(this.path);
        this.saveAll();
    }
    get(key) {
        if (
            typeof this.data[key] !== "undefined" &&
            typeof this.data[key].type !== "undefined"
        ) {
            if (this.data[key].type === "Buffer") {
                return Buffer.from(this.data[key].data);
            }
        }
        return this.data[key];
    }
    set(key, val) {
        this.data[key] = val;
        this.saveAll();
    }
    saveAll() {
        fs.writeFileSync(this.path, JSON.stringify(this.data, null, 4));
    }
}

const parseDataFile = (filePath) => {
    let data = {};
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "{}");
        }
        const file = fs.readFileSync(filePath);
        data = JSON.parse(file);
    } catch (error) {}
    if (!data.key) {
        data.key = randomBytes(32);
    }
    if (!data.iv) {
        data.iv = randomBytes(16);
    }
    if (!data.fileName) {
        data.fileName = path.join(userDataPath, "bdd.zip.enc");
    }
    return data;
};

const getFromStore = (key, defaultValue) => {
    let currentConfig = new Store();
    let value = currentConfig.get(key);
    if (!value && defaultValue) {
        currentConfig.set(key, defaultValue);
        value = defaultValue;
    }
    return value;
};
const getFromStoreCallback = async (key, defaultValue) => {
    let currentConfig = new Store();
    let value = currentConfig.get(key);
    if (!value && defaultValue) {
        if (typeof defaultValue === "function") {
            defaultValue = await defaultValue();
        }
        currentConfig.set(key, defaultValue);
        value = defaultValue;
    }
    return value;
};

const setPassword = async (password = randomBytes(32).toString()) => {
    let currentConfig = new Store();
    const hash = await bcrypt.hash(password, 10);
    currentConfig.set("hash", hash);
};

// expose the class
module.exports = {
    Store,
    setPassword,
    getFromStore,
    getFromStoreCallback,
};
