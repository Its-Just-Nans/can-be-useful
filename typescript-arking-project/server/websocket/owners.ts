import type WebSocket from "ws";
import { JtoS } from "../../shared/constants";

let owners: { [e: string]: WebSocket } = {};

export const sendUpdateToOwners = (msg: object) => {
    for (const owner in owners) {
        console.log("sending to owner", owner);
        owners[owner].send(JtoS(msg));
    }
};

export const addToOwners = (id: string, ws: WebSocket) => {
    owners[id] = ws;
};
