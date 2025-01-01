const path = require("path");
const fs = require("fs");
const axios = require("axios");
const Parser = require("rss-parser");
const CONFIG = require("./config.json");
let parser = new Parser();

const FILE = path.join(__dirname, CONFIG.DATA_FILE);

const job = async () => {
    let feed = await parser.parseURL(CONFIG.RSS_FEED);
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, "[]");
    }
    const txt = fs.readFileSync(FILE).toString();
    const data = JSON.parse(txt);
    const array = feed.items.reverse();
    for (const item of array) {
        const label = `${item.title}#${item.link}#${item.pubDate}`;
        if (!data.find((oneLabel) => oneLabel === label)) {
            await webhook(item);
            data.push(label);
        }
    }
    fs.writeFileSync(FILE, JSON.stringify(data, null, 4));
};

const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const webhook = async (item) => {
    const data = {
        content: `${item.title}\n${item.link}\n${item.pubDate}`,
        username: CONFIG.USERNAME || "rss-checker",
        avatar_url: CONFIG.AVATAR_URL || "",
    };
    await axios.post(CONFIG.URL_WEBHOOK, data);
    await sleep(1000);
};

job();
