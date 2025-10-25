import WebSocket from "ws"; // npm install ws

const DEFAULT_URL = "https://discord.com/api/webhooks/...";

const MMSIs = {
    // TODO: add your MMSIs here
    111111111: DEFAULT_URL,
};
const API_KEY = ""; // Would need to be established first

const sendWebhook = (msg, webhookUrl = DEFAULT_URL) => {
    const data = {
        content: msg,
        username: "aisstream",
    };
    fetch(webhookUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log("webhook: sent", msg);
};

process.on("uncaughtException", (err, origin) => {
    console.error("Uncaught Exception origin ->", origin);
    console.error("Uncaught Exception err ->", err);
    sendWebhook("uncaughtException" + JSON.stringify({ origin, err }));
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled rejection promise ->", promise);
    console.error("Unhandled rejection reason  ->", reason);
    sendWebhook("unhandledRejection" + JSON.stringify({ reason, promise }));
});

const main = () => {
    const socket = new WebSocket("wss://stream.aisstream.io/v0/stream");
    socket.addEventListener("open", (_) => {
        const subscriptionMessage = {
            APIkey: API_KEY,
            BoundingBoxes: [
                [
                    [-180, -90],
                    [180, 90],
                ],
            ],
            FiltersShipMMSI: Object.keys(MMSIs),
        };
        socket.send(JSON.stringify(subscriptionMessage));
        console.log("connection openned");
    });

    socket.addEventListener("error", (event) => {
        console.log("error event", event);
        sendWebhook("error event" + JSON.stringify(event));
        socket.close();
        main();
    });

    socket.addEventListener("close", (event) => {
        console.log("close event", event);
        socket.close();
        main();
    });

    socket.addEventListener("message", (event) => {
        console.log("message", event);
        let aisMessage = JSON.parse(event.data);
        const mmsi = aisMessage["MetaData"]["MMSI"].toString();
        const url = MMSIs[mmsi] ?? DEFAULT_URL;
        sendWebhook("message " + JSON.stringify(aisMessage), url);
    });
};

main();
