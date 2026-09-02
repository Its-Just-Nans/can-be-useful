const json = require("./exo2.json");

const res = {};

a = json.forEach((a) => {
    if (!res[a[0]]) {
        res[a[0]] = [];
    }
    res[a[0]].push(a[2]);
    res[a[0]] = [...new Set(res[a[0]])];
});

Object.entries(res).forEach(([key, value]) => {
    value.sort((a, b) => {
        const match = a.split("/")[1].localeCompare(b.split("/")[1]);
        if (match === 0) {
            const m1 = parseInt(a.split("/")[0]);
            const m2 = parseInt(b.split("/")[0]);
            if (m1 === m2) {
                return 0;
            } else if (m1 > m2) {
                return 1;
            }
            return -1;
        }
        return match;
    });
});

Object.entries(res).forEach(([key, value]) => {
    if (value.length < 3) {
        delete res[key];
    }
});

const rep = [];

const g = (st) => {
    return parseInt(st) * 12;
};

Object.entries(res).forEach(([key, value]) => {
    for (let i = 0; i < value.length; i++) {
        if (typeof value[i - 1] === "string" && typeof value[i] === "string" && typeof value[i + 1] == "string") {
            const a = parseInt(value[i - 1].split("/")[0]) + g(value[i - 1].split("/")[1]);
            const b = parseInt(value[i].split("/")[0]) + g(value[i].split("/")[1]);
            const c = parseInt(value[i + 1].split("/")[0]) + g(value[i + 1].split("/")[1]);
            if (b - a === c - b) {
                rep.push(key);
                console.log(key + "     " + i + "   " + value[i]);
                break;
            }
        }
    }
});

console.log(JSON.stringify(res, null, 4));
console.log(rep);

["16235167", "48644524", "68362850", "96877928", "98578956"];

["16235167", "48644524", "68362850", "96877928", "98578956", "35673565"];
