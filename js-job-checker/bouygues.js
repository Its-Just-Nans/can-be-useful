const { webhook } = require("./webhook");
const { readFile, writeFile } = require("./useful");
const CONFIG = require("./config.json");
const path = require("path");
const Parser = require("rss-parser");
let parser = new Parser();

const FILE = path.join(__dirname, "bouygues.json");

const job = async () => {
    let feed = await parser.parseURL(CONFIG.RSS_FEED);
    const data = readFile(FILE);
    const array = feed.items.reverse();
    for (const item of array) {
        const label = `${item.title}#${item.link}#${item.pubDate}`;
        if (!data.find((oneLabel) => oneLabel === label)) {
            await webhook(`${item.title}\n${item.link}\n${item.pubDate}`);
            data.push(label);
        }
    }
    writeFile(FILE, data);
};

module.exports = { job };
