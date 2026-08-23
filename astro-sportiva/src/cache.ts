import type { ParsedGPX } from "@we-gold/gpxjs";

type StockageType = {
    [key: string]: ParsedGPX;
};

export const stockage: StockageType = {};
