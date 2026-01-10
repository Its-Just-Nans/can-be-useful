import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const parkings = sqliteTable("parking", {
    idParking: integer("idParking").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    schema: text("schema").notNull(),
    idAdmin: integer("idAdmin").notNull(),
});

export const places = sqliteTable("place", {
    idPlace: integer("idPlace").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    time: integer("time").notNull(),
    state: text("state").notNull(),
    plaque: text("plaque").notNull(),
    ip: text("ip").notNull(),
    idParking: integer("idParking").notNull(),
    typePlace: text("typePlace").notNull(),
});

export const clients = sqliteTable("client", {
    idClient: integer("idClient").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    password: text("password").notNull(), //TODO not protected for now
    plaque: text("content").notNull(),
    payment: text("payment").notNull(),
    balance: integer("balance").notNull(),
    isAdmin: integer("isAdmin").notNull(),
});
