import type WebSocket from "ws";
import { setWsClient, sendObjectToClient } from "./websocketsClients";

type WsClients = { [e: string]: WebSocket };

let unknownMAC: WsClients = {};

export const setMac = (name: string, ws: WebSocket) => {
    unknownMAC[name] = ws;
};

export const getUnknownMAC = () => unknownMAC;

export const removeMac = (mac: string, id: number) => {
    const ws = unknownMAC[mac];
    setWsClient(id.toString(), ws);
    sendObjectToClient(id.toString(), { request: "setId", id: id });
    delete unknownMAC[mac];
};
