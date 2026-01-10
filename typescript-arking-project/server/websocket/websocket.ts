import { WebSocketServer, type RawData } from "ws";
import type WebSocket from "ws";
import type { Server } from "http";
import { db } from "../db/db";
import { places } from "../db/schema";
import { PLACES_STATES, parseJSON, JtoS } from "../../shared/constants";
import { eq } from "drizzle-orm";
import { addToStackOut, getLatestClientIn } from "../api/carStack";
import { sendUpdateToOwners, addToOwners } from "./owners";
import { setWsClient } from "./websocketsClients";
import { setMac } from "../websocket/macs";

let wss;

export default (server: Server) => {
    wss = new WebSocketServer({ server });
    init(wss);
};

const init = (wss: WebSocketServer) => {
    wss.on("connection", function connection(ws) {
        console.log("new connection");
        ws.on("error", console.error);
        ws.on("message", (data) => onMessage(data, ws));
        ws.send(JtoS({ request: "name" }));
        ws.on("close", () => {});
    });
};

const onMessage = async (stringData: RawData, ws: WebSocket) => {
    const data = parseJSON(stringData.toString());
    const { request, response, ...rest } = data;
    if (request === "getId") {
        // we retreive the id of the place
        const { name } = rest;
        const [onePlace] = await db.select().from(places).where(eq(places.name, name));
        if (onePlace) {
            ws.send(JtoS({ response: "getId", id: onePlace.idPlace }));
            setWsClient(onePlace.idPlace.toString(), ws);
        } else {
            setMac(name, ws);
            sendUpdateToOwners({ request: "reload", name: "macs" });
        }
    } else if (request === "car") {
        const { car: isCar, id } = rest.car;
        if (!id || !isCar) {
            ws.send(JtoS({ response: "error", error: "invalid request" }));
            return;
        }
        const newState = isCar ? PLACES_STATES.BUSY : PLACES_STATES.FREE;
        await db.update(places).set({ state: newState }).where(eq(places.idPlace, id));
    } else if (request === "info") {
        const { state, id } = rest;
        if (typeof id === "number") {
            placeChangeState(id, state);
        }
    } else if (response === "name") {
        // we receving a name
        const { id, isAdmin, name } = rest;
        if (isAdmin) {
            addToOwners(name, ws);
        } else {
            if (typeof id === "number") {
                setWsClient(id.toString(), ws);
            } else {
                // he don't have an id
                const [captor] = await db.select().from(places).where(eq(places.name, name));
                if (!captor) {
                    setMac(name, ws);
                    sendUpdateToOwners({ request: "reload", name: "macs" });
                }
            }
        }
    } else {
        console.log("unknown request", data.toString());
    }
    sendUpdateToOwners({ request: "info", info: data });
};

const placeChangeState = async (id: number, state: string) => {
    if (state == PLACES_STATES.BUSY) {
        // someone is parking
        const [onePlace] = await db.select().from(places).where(eq(places.idPlace, id));
        let plaque = "";
        if (onePlace) {
            const latest = getLatestClientIn(onePlace.idParking.toString());
            if (latest) {
                plaque = latest.plaque;
            }
        }
        await db
            .update(places)
            .set({ state: PLACES_STATES.BUSY, plaque: plaque, time: new Date().getTime() })
            .where(eq(places.idPlace, id));
    } else if (state == PLACES_STATES.FREE) {
        // someone is leaving
        const [place] = await db.select().from(places).where(eq(places.idPlace, id));
        await db.update(places).set({ state: PLACES_STATES.FREE, plaque: "", time: 0 }).where(eq(places.idPlace, id));
        if (place.plaque !== "") {
            addToStackOut(place.idParking.toString(), { plaque: place.plaque, time: place.time, idPlace: id });
        }
    }
    console.log("Reload for owner");
    sendUpdateToOwners({ request: "reload", name: "parking", idPlace: id });
    sendUpdateToOwners({ request: "reload", name: "cars", idPlace: id });
};
