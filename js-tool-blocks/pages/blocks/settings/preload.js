const os = require("os");
const path = require("path");
const fs = require("fs");

const start = function () {
    console.log("start");
};

const unzip = async function (from, dest) {
    const AdmZip = require("adm-zip");
    var zip = new AdmZip(from);
    const zipEntries = zip.getEntries();
    let index = zipEntries.findIndex(function (oneZipEntry) {
        return oneZipEntry.entryName.includes("package.json");
    });
    let needToCreateFolder = false;
    if (index == -1) {
        // no package.json so we search index.html
    } else {
        const linkToPackege = zipEntries[index].entryName;
    }
    const firstEntry = zipEntries[0].entryName.toString();
    const name = path.basename(from);
    if (needToCreateFolder == true) {
        await fs.mkdir(dest);
    }
    console.log(firstEntry, name);
    await zip.extractAllToAsync(dest, true);
};

const installBlock = async function (fileOrPath) {
    if (typeof fileOrPath === "undefined" || fileOrPath == null) {
        return false;
    }
    const extensionAccepted = [".7z", ".gz", ".zip"];
    let name = path.basename(fileOrPath);
    let needUnzip = false;
    for (const oneExtension of extensionAccepted) {
        if (name.endsWith(oneExtension)) {
            needUnzip = true;
            name = name.substring(0, name.length - oneExtension.length);
        }
    }
    if (needUnzip) {
        const destPath = path.join(__dirname, `../${name}`);
        if (await fs.access(destPath)) {
            //folder exists
        }
        unzip(fileOrPath, destPath);
    }
    // check for unzip
    if (typeof file === "string") {
    } else {
    }
    // check for NPM install
};

const execSh = async function (cde, param = [], path = "./") {
    return new Promise((resolve, reject) => {
        let cmd = spawn(cde, [...param], { cwd: path, shell: true });

        let stdout = "";
        let stderr = "";
        cmd.stdout.on("data", (data) => {
            stdout += data.toString();
        });
        cmd.stderr.on("data", (data) => {
            stderr += data.toString();
        });
        cmd.on("error", (err) => {
            reject(err);
        });
        cmd.on("close", (code, signal) => {
            resolve({ code, signal, stdout, stderr });
        });
    });
};

module.exports = {
    installBlock,
    execSh,
    start,
};
