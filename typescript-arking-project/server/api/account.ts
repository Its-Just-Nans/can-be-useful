import type { Context, Next } from "hono";
import { eq, and, or } from "drizzle-orm";

import { db } from "../db/db";
import { clients, places } from "../db/schema";
import { PLACES_STATES, PLACES_TYPES, generateToken } from "../../shared/constants";
import { MISSING_PARAMS, USER_EXISTS, USER_NOT_FOUND } from "../../shared/errors";
import { sendUpdateToOwners } from "../websocket/owners";
import { sendObjectToClient } from "../websocket/websocketsClients";

export const tokens: { [s: string]: string } = {};

export const login = async (c: Context) => {
    const { username, password } = await c.req.json();
    if (!username || !password) {
        return c.json({ error: "Missing username or password" }, 400);
    }
    const [item] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.name, username.toString()), eq(clients.password, password.toString())))
        .limit(1);
    if (!item) {
        return c.json(USER_NOT_FOUND, 400);
    }
    const token = generateToken();
    tokens[token] = username.toString();
    const { password: _, ...usertoSend } = item;
    return c.json({ token, user: usertoSend }, 200);
};

export const logout = async (c: Context) => {
    const auth = c.req.header("Authorization");
    if (auth) {
        const token = auth.split(" ")[1];
        delete tokens[token];
        return c.json({ succes: true }, 200);
    }
    return c.json({ succes: false }, 400);
};

export const register = async (c: Context) => {
    const { username, password, plaque } = await c.req.json();
    if (!username) {
        return c.json({ ...MISSING_PARAMS, error: "Missing username in body" }, 400);
    }
    if (!password) {
        return c.json({ ...MISSING_PARAMS, error: "Missing password in body" }, 400);
    }
    if (!plaque) {
        return c.json({ ...MISSING_PARAMS, error: "Missing plaque" }, 400);
    }
    const item = await db
        .select()
        .from(clients)
        .where(or(eq(clients.name, username.toString()), eq(clients.plaque, plaque.toString())))
        .limit(1);
    if (item.length > 0) {
        return c.json(USER_EXISTS, 404); // user already exists
    }
    await db.insert(clients).values({
        name: username.toString(),
        password: password.toString(),
        payment: "",
        balance: 0,
        plaque: plaque.toString(),
        isAdmin: username.toString() === "n4n5" ? 1 : 0,
    });
    const newUser = await db
        .select()
        .from(clients)
        .where(and(eq(clients.name, username.toString()), eq(clients.password, password.toString())))
        .limit(1);
    return c.json(newUser, 200);
};

export const parseUser = async (c: Context, next: Next) => {
    const auth = c.req.header("Authorization");
    if (auth) {
        const token = auth.split(" ")[1];
        const email = tokens[token];
        if (email) {
            const [user] = await db.select().from(clients).where(eq(clients.name, email)).limit(1);
            if (user) {
                c.set("user", user);
            }
        }
    }
    await next();
};

export const addBalance = async (c: Context) => {
    const { amount } = await c.req.json();
    const user = c.get("user");
    if (typeof amount === "undefined") {
        return c.json({ error: "Missing amount" }, 400);
    }
    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    await db
        .update(clients)
        .set({ balance: user.balance + amount })
        .where(eq(clients.idClient, user.idClient));
    const [newUser] = await db.select().from(clients).where(eq(clients.idClient, user.idClient)).limit(1);
    return c.json(newUser, 200);
};

export const reservePlace = async (c: Context) => {
    const { idPlace } = await c.req.json();
    const user = c.get("user");
    if (typeof idPlace === "undefined") {
        return c.json({ error: "Missing amount" }, 400);
    }
    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    // first we check if the place is free
    const [place] = await db.select().from(places).where(eq(places.idPlace, idPlace)).limit(1);
    if (!place) {
        return c.json({ error: "Place not found" }, 404);
    }
    if (place.state !== PLACES_STATES.FREE) {
        return c.json({ error: "Place not free" }, 400);
    }
    if (place.typePlace === PLACES_TYPES.ROAD) {
        return c.json({ error: "Place is a road !" }, 400);
    }
    await db
        .update(places)
        .set({ state: PLACES_STATES.RESERVED, plaque: user.plaque })
        .where(eq(places.idPlace, idPlace));
    sendObjectToClient(place.idPlace.toString(), { request: "setState", state: PLACES_STATES.RESERVED });
    sendUpdateToOwners({ request: "reload", name: "parking", idPlace: idPlace });
    return c.json({ succes: true }, 200);
};
