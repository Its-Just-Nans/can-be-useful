import type WebSocket from "ws";

type WsClients = { [e: string]: WebSocket };

let ws_clients: WsClients = {};

export const setWsClient = (id: string, ws: WebSocket) => {
    console.log("setWsClient", id);
    console.log("setWsClient", id);
    console.log("setWsClient", id);
    console.log("setWsClient", id);
    console.log("setWsClient", id);
    console.log("setWsClient", id);
    ws_clients[id] = ws;
};

export const sendObjectToClient = (id: string, obj: any) => {
    const str = JSON.stringify(obj);
    console.log("sendObjectToClient", id, str);
    console.log("sendObjectToClient", id, str);
    console.log("sendObjectToClient", id, str);
    if (ws_clients[id]) {
        ws_clients[id].send(str);
    }
};
