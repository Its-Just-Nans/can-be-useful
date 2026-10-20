const DB = require("./db");

const analyse = (db, data) => {
    let object = [];
    if (data && data.length > 0) {
        const items = DB.getAll(db);
        object = analyseObject(items, data);
    }
    return object;
};

const analyseObject = (items, obj) => {
    let toReturn = null;
    if (typeof obj !== "undefined" && obj !== null) {
        if (Array.isArray(obj)) {
            toReturn = [];
            for (const oneElement of obj) {
                const temp = analyseObject(items, oneElement);
                toReturn.push(temp);
            }
        } else if (typeof obj === "object") {
            toReturn = {};
            if (obj.children && obj.children.length > 0) {
                toReturn.children = analyseObject(items, obj.children);
            }
            if (obj.localName === "input") {
                if (obj.type !== "hidden") {
                    if (obj.name) {
                        const value = searchByName(items, obj.name);
                        toReturn.value = value;
                    }
                }
            }
        }
    }
    return toReturn;
};

const searchByName = (items, name) => {
    let res = "";
    if (items && items.length > 0) {
        items.forEach((element) => {
            if (element.keywords && element.keywords.length > 0) {
                element.keywords.forEach((keyword) => {
                    if (keyword.toLowerCase() === name.toLowerCase()) {
                        res = element.value;
                    }
                });
            }
        });
    }
    return res;
};

module.exports = {
    analyse,
};

// const js = require("./data.json");
// console.log(JSON.stringify(analyse(js)));
