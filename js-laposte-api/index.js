const axios = require("axios");
const process = require("process");
const config = require("./config.json");

const totalURL = `${config.API_url}${config.PACKAGE_number}?lang=${config.API_lang}`;

async function main() {
    const { data } = await axios.get(totalURL, {
        headers: {
            "X-Okapi-Key": config.API_key,
            "accept": "application/json",
        }
    }).catch((error) => {
        console.log(`Request to ${totalURL} failed`);
        console.log(error.toString());
        process.exit();
    });

    // formatting
    let dataWebHook = {
        username: "La Poste",
        content: "Info colis",
        embeds: [],
    };
    for (let oneTimeEvent of data.shipment.timeline) {
        if (oneTimeEvent.shortLabel != "") {
            dataWebHook.embeds.push({
                title: oneTimeEvent.date || "No date",
                description: oneTimeEvent.shortLabel || "",
            });
        }
    }
    //console.log(JSON.stringify(data.shipment.timeline));

    if (typeof config.WEBHOOK_URL !== "undefined" && config.WEBHOOK_URL !== "") {
        await axios.post(config.WEBHOOK_URL, dataWebHook).catch((error) => {
            console.log(`Request to ${config.WEBHOOK_URL} failed`);
            console.log(error.toString());
            process.exit();
        });
    }
}

main();