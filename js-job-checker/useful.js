const fs = require("fs");

const readFile = (nameOfFile) => {
    if (!fs.existsSync(nameOfFile)) {
        fs.writeFileSync(nameOfFile, "[]");
    }
    const txt = fs.readFileSync(nameOfFile).toString();
    return JSON.parse(txt);
};

const writeFile = (nameOfFile, data) => {
    fs.writeFileSync(nameOfFile, JSON.stringify(data, null, 4));
};

module.exports = {
    readFile,
    writeFile,
};
