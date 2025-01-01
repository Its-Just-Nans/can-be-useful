import ForemClient from "forem-client";
import axios from "axios";
import {
    quest,
    questSafe,
    formatQuestion,
    getArticles,
    sendArticles,
    getConfig,
    saveConfig,
    showConfig,
    indexStr,
} from "./utils.js";

let client = new ForemClient(axios);

const MENUS = {
    EXIT: "exit",
    SET_USER: "set user",
    GET_ARTICLES: "get articles",
    SEND_ARTICLES: "send articles",
    SET_APIKEY: "set api-key",
    PUSH_ARTICLES: "push articles",
    SAVE_CONFIG: "save config",
    SHOW_CONFIG: "show config",
};

const start = async () => {
    const ans = [
        MENUS.EXIT,
        MENUS.SET_USER,
        MENUS.GET_ARTICLES,
        MENUS.SEND_ARTICLES,
        MENUS.SET_APIKEY,
        MENUS.PUSH_ARTICLES,
        MENUS.SAVE_CONFIG,
        MENUS.SHOW_CONFIG,
    ];
    const defQuestion = formatQuestion("-----------\nWhat do you want to do ?", ans);
    let answer = null;
    let config = getConfig();
    if (typeof config.client !== "undefined") {
        client.setUser(config.client);
    }
    if (typeof config.apikey !== "undefined") {
        client.setAPIkey(config.apikey);
    }
    if (config.client && config.client.username) {
        console.log(`--> Using ${config.client.username}`);
    }
    while ((answer = await quest(defQuestion)) !== "1") {
        switch (answer) {
            case indexStr(ans, MENUS.SET_USER): {
                const username = await questSafe("Enter the username\n");
                if (username === "0") {
                    continue;
                }
                const clientObj = await client.GET_getUserByUsername(username).catch(() => {
                    console.log("--> user not found ! :(");
                });
                if (typeof clientObj !== "undefined") {
                    client.setUser(clientObj);
                    config.client = clientObj;
                }
                break;
            }
            case indexStr(ans, MENUS.GET_ARTICLES): {
                await getArticles(client);
                break;
            }
            case indexStr(ans, MENUS.SEND_ARTICLES): {
                await sendArticles(client);
                break;
            }
            case indexStr(ans, MENUS.SET_APIKEY): {
                const apikey = await questSafe(
                    "Enter the api-key\nGo to https://dev.to/settings/extensions to get your key\n"
                );
                if (apikey === "0") {
                    continue;
                }
                client.setAPIkey(apikey);
                const needSave = await questSafe(formatQuestion("Save api-key in config ?", ["yes", "no"]));
                if (needSave === "0") {
                    continue;
                } else if (needSave.indexOf("yes")) {
                    config.apikey = apikey;
                    console.log("--> API key registered in the config (don't forget to save the config !)");
                }
                break;
            }
            case indexStr(ans, MENUS.PUSH_ARTICLES): {
                pushArticles();
                break;
            }
            case indexStr(ans, MENUS.SAVE_CONFIG): {
                saveConfig(config);
                break;
            }
            case indexStr(ans, MENUS.SHOW_CONFIG): {
                showConfig(config);
                break;
            }
        }
    }
};

start().catch((e) => {
    if (typeof e !== "undefined") {
        console.log(`ERROR : ${e.message}`);
    }
    console.log("Exited");
});
