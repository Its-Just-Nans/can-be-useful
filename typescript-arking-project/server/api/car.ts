import type { Context } from "hono";
import { eq, and, ne } from "drizzle-orm";

import { db } from "../db/db";
import { clients, places } from "../db/schema";
import { PLACES_STATES } from "../../shared/constants";
import { CLIENT_NOT_FOUND, NO_MONEY, NO_PLACE_FOUND, ALREADY_PRESENT } from "../../shared/errors";
import { addToStackIn, getLatestClientOut } from "./carStack";
import { sendUpdateToOwners } from "../websocket/owners";

const getToPay = (timeIn: number) => {
    return 10;
};

export const carDetected = async (c: Context) => {
    const { direction, plaque, parkingid: parkingId } = await c.req.json();
    console.log({ direction, plaque, parkingId });
    if (direction === "out") {
        // we check the time of the place
        const place = getLatestClientOut(parkingId.toString(), plaque);
        if (!place) {
            return c.json(NO_PLACE_FOUND, 400);
        }
        const time = place.time;
        const date = new Date();
        const timeOut = date.getTime();
        const timeIn = timeOut - time;
        const toPay = getToPay(timeIn);
        //we update the place
        await db
            .update(places)
            .set({ state: PLACES_STATES.FREE, plaque: "", time: 0 })
            .where(eq(places.plaque, plaque));
        sendUpdateToOwners({ request: "reload", name: "parking", idPlace: place.idPlace });
        sendUpdateToOwners({ request: "reload", name: "cars", idPlace: place.idPlace });
        // we get the client
        const clientList = await db.select().from(clients).where(eq(clients.plaque, plaque));
        if (clientList.length === 0) {
            return c.json({ ...CLIENT_NOT_FOUND, needToPay: toPay });
        }
        const client = clientList[0];
        const balance = client.balance;
        if (balance < toPay) {
            return c.json({ ...NO_MONEY, needToPay: toPay });
        }
        // we update the client
        await db
            .update(clients)
            .set({ balance: balance - toPay })
            .where(eq(clients.plaque, plaque));
        return c.json({ paid: toPay, needToPay: 0, balance: balance - toPay });
    }
    // direction === "in"
    const [place] = await db.select().from(places).where(eq(places.plaque, plaque));
    if (place) {
        return c.json(ALREADY_PRESENT, 400);
    }
    addToStackIn(parkingId.toString(), { plaque, time: new Date().getTime() });
    sendUpdateToOwners({ request: "reload", name: "cars" });
    const [client] = await db.select().from(clients).where(eq(clients.plaque, plaque));
    if (!client) {
        return c.json(CLIENT_NOT_FOUND);
    }
    return c.json({ client: client.name });
};
