import fs from "node:fs";
import path from "node:path";
import axios from "axios";

const SERVER_URL = "https://readme-compiler.vercel.app";

export const historyGeneration = async () => {
    const newPath = path.resolve(path.dirname("."));
    const pathToTxt = path.join(newPath, "txt");
    let actualHistory = fs.readFileSync(path.join(pathToTxt, "history.json")).toString();
    actualHistory = JSON.parse(actualHistory);
    for (const oneEntry of actualHistory) {
        console.log(oneEntry.title);
        const correctPath = path.join(pathToTxt, oneEntry.desc);
        if (fs.existsSync(correctPath)) {
            const myMarkdown = fs.readFileSync(correctPath).toString();
            oneEntry.desc = await getMarkdown(myMarkdown);
        }
    }
    fs.writeFileSync(path.join(newPath, "json", "history.json"), JSON.stringify(actualHistory, null, 4));
};

export const getMarkdown = async (myMarkdown) => {
    const ans = await axios({
        url: `${SERVER_URL}/api/`,
        method: "POST",
        data: myMarkdown,
        headers: { "content-type": "text/plain;charset=UTF-8" },
    }).catch((e) => {
        e;
    });
    return ans.data;
};
