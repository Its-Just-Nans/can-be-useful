const axios = require("axios");
const CONFIG = require("./config.json");

const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const webhook = async (content) => {
    const data = {
        content: content,
        username: CONFIG.USERNAME || "rss-checker",
        avatar_url: CONFIG.AVATAR_URL || "",
    };
    await axios.post(CONFIG.URL_WEBHOOK, data);
    await sleep(1000);
};

module.exports = {
    sleep,
    webhook,
};
