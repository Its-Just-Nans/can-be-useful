import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import fs from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_FILENAME = ".forem-client-config";

const sleep = async (time) => new Promise((res, rej) => setTimeout(res, time * 1000));

export const getConfig = () => {
    const pathToHomedir = homedir();
    const pathToFileConfig = join(pathToHomedir, CONFIG_FILENAME);
    if (fs.existsSync(pathToFileConfig)) {
        try {
            let fileInString = fs.readFileSync(pathToFileConfig).toString();
            return JSON.parse(fileInString);
        } catch (e) {
            return {};
        }
    }
    return {};
};

export const saveConfig = (config) => {
    const pathToHomedir = homedir();
    const pathToFileConfig = join(pathToHomedir, CONFIG_FILENAME);
    try {
        fs.writeFileSync(pathToFileConfig, JSON.stringify(config));
        console.log("--> Config saved");
    } catch (e) {
        console.log("--> Config save failed :(");
    }
};

export const showConfig = (config) => {
    const pathToHomedir = homedir();
    const pathToFileConfig = join(pathToHomedir, CONFIG_FILENAME);
    try {
        const file = fs.readFileSync(pathToFileConfig).toString();
        const parsed = JSON.parse(file);
        const str = JSON.stringify(parsed, null, 4);
        console.log(str);
    } catch (e) {
        console.log("--> Config save failed :(");
    }
};

export const quest = (question, count = 1) => {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input,
            output,
        });
        const callback = (input) => {
            if (count == 0) {
                rl.removeListener("SIGINT", callback);
                rl.close();
                reject(new Error("LEAVED"));
            } else {
                console.log("-->One more time to leave");
                //console.log(question);
                count--;
            }
        };
        rl.on("SIGINT", callback);
        rl.question(question, (ans) => {
            rl.close();
            resolve(ans);
        });
    });
};

export const questSafe = async (question, count = 0) => {
    let resTemp = "";
    resTemp = await quest(question, count).catch(() => {});
    return typeof resTemp !== "undefined" ? resTemp : "0";
};

export const formatQuestion = (ques, arrayAns) => {
    let final = ques;
    let count = 1;
    arrayAns.forEach((temp) => {
        final += `\n${count++} - ${temp}`;
    });
    return `${final}\n`;
};

export const getArticles = async (client) => {
    let username = client.getUser().username;
    if (typeof username === "undefined") {
        username = await questSafe("Enter the name :");
    }
    if (username == "0" || typeof username === "undefined") {
        return;
    }
    console.log(`Using user ${username}`);
    await sleep(1);
    let res = await client.GET_articles({ username });
    if (res && res.length > 0) {
        res.forEach((element) => {
            console.log(JSON.stringify(element, null, 4));
        });
    } else {
        console.log("No articles ! :(");
    }
};

export const sendArticles = async (client) => {
    const typeOfArticle = await questSafe(formatQuestion("What do you want to do ?", ["file", "create new now"]));
    if (typeOfArticle === "1") {
        let pat;
        while ((pat = await questSafe("Type the path\n")) == "0" ? false : !fs.existsSync(pat)) {
            console.log("file not found :(");
        }
        if (fs.existsSync(pat)) {
            console.log("file found !");
        }
    } else if (typeOfArticle == "2") {
        const article = await createArticle();
        let res = await client
            .POST_articles({
                article: article,
            })
            .catch((e) => {
                if (e && e.response && e.response.status) {
                    console.log(e.response.statusText);
                }
            });
        if (res && res.id) {
            console.log(`The Id of the new article : ${res.id}`);
        } else {
            console.log("No articles ! :(");
        }
    } else {
        console.log("Aborted");
    }
};

const createArticle = async () => {
    const title = await questSafe("Title : ");
    const content = await questSafe("Content : ");
    const description = await questSafe("description : ");
    let published = await questSafe("published (bool) : ");
    published = published == "true" ? true : false;
    return {
        title,
        body_markdown: content,
        published,
        series: await questSafe("series : "),
        main_image: await quest("main_image : "),
        canonical_url: await quest("canonical_url : "),
        description: await quest("description : "),
        tags: await quest("tags : "),
        organization_id: await quest("organization_id : "),
    };
};

export const indexStr = (ans, name) => {
    return (ans.indexOf(name) + 1).toString();
};
