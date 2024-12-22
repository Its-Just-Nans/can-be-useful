const axios = require("axios");
const { webhook } = require("./webhook");
const { readFile, writeFile } = require("./useful");
const path = require("path");

const URL = "https://orange.jobs/jobs/v3/offers/search?lang=en";
const FILE = path.join(__dirname, "orange.json");

const job = async () => {
    const dataRegistered = readFile(FILE);
    const data = {
        index: 2,
        nb: 10000,
        latmin: "48.586146470272396",
        latmax: "48.99058106202765",
        lngmin: "2.1574401855468754",
        lngmax: "2.5007629394531254",
        carto: "",
        contract: ["474"],
    };
    const rep = await axios.post(URL, data);
    if (rep && rep.data && rep.data.items) {
        for (const item of rep.data.items.reverse()) {
            const label = `${item.title}#${item.fulllocation}#${item.pubdate}`;
            if (!dataRegistered.find((oneLabel) => oneLabel === label)) {
                await webhook(
                    `${item.title}\n${item.fulllocation}\n${item.pubdate}\n${
                        item.url || "Pas de lien dispo, voir le site"
                    }`
                );
                dataRegistered.push(label);
            }
        }
        writeFile(FILE, dataRegistered);
    }
};

module.exports = { job };
