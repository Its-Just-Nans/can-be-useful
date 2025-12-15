const os = require("os");
const { spawn } = require("child_process");

const start = function () {
    console.log("start");
};

const osTEST = function () {
    return os.homedir();
};

const execSh = async function (cde, param = [], path = "../", obj) {
    return new Promise((resolve, reject) => {
        let cmd = spawn(cde, [...param], { cwd: path, shell: true });
        cmd.stdout.on("data", (data) => {
            obj.stdout = data.toString();
        });
        cmd.stderr.on("data", (data) => {
            obj.stderr = data.toString();
        });
        cmd.on("error", (err) => {
            reject(err);
        });
        cmd.on("close", (code, signal) => {
            resolve({ code, signal, obj });
        });
    });
};

module.exports = {
    start,
    osTEST,
    execSh,
};
