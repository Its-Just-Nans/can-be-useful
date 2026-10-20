const fs = require("fs");

const path = "auto-form-app/pages/langs/fr_FR.js";

const file = fs.readFileSync(path).toString();

const regex = /": "(.)/g;
s = file.replace(regex, function (x) {
    const part1 = x.substring(0, x.length - 1);
    const part2 = x.substring(x.length - 1, x.length);
    return part1 + part2.toUpperCase();
});

fs.writeFileSync(path, s);