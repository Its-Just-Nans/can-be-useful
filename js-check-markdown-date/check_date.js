const fs = require("fs");

const NAME_OF_FILE = "test_wrong.md";

const file = fs.readFileSync(NAME_OF_FILE).toString();

const regex = /^## .*/gm;
const found = file.match(regex);

if (!found) {
    console.log(`There are no ## in ${NAME_OF_FILE}`);
    return;
}

console.log(`There are ${found.length} times ## in ${NAME_OF_FILE}`);

let lastDate = new Date(0);
let i = 0;
for (const oneMatch of found) {
    const txt = oneMatch.match(/\d\d\d\d-\d\d-\d\d/g);
    if (!txt) {
        console.log(oneMatch);
        continue;
    }
    const currentDate = new Date(txt[0]);
    if (txt.length > 1) {
        // add one day to currentDate and print only 10 first char
        const compare = new Date(currentDate);
        compare.setDate(currentDate.getDate() + 1);
        const a = compare.toISOString().split("T")[0];
        if (txt[1] !== a) {
            console.log(a);
            console.log(txt);
        }
    }
    if (currentDate - lastDate >= 0) {
        lastDate = currentDate;
    } else {
        console.log(txt);
        console.log("KO");
    }
    i++;
}

console.log(`There are ${i} dates in ${NAME_OF_FILE}`);
