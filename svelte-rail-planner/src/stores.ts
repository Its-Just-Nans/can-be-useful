import L from "leaflet";
import { writable } from "svelte/store";

import gares from "./assets/json/gares-de-voyageurs.json";
import ter from "./assets/json/tarifs-ter-par-od.json";
import intercites from "./assets/json/tarifs-intercites.json";
import tgv from "./assets/json/tarifs-tgv-inoui-ouigo.json";

import icoGreen from "./assets/marker-icon-2x-green.png";
import icoGold from "./assets/marker-icon-2x-gold.png";
import icoNormal from "./assets/marker-icon.png";
import icoShadow from "./assets/marker-shadow.png";

export const data = writable({
    gares,
    garesIndex: gares.reduce((acc, gare) => {
        for (const one_code of gare.codes_uic.split(";")) {
            acc[one_code] = gare;
        }
        return acc;
    }, {}),
    intercites,
    ter,
    tgv,
});
export const start = writable<string>("87686667"); // paris beryc bourgogne
export const stop = writable<string>("87723197"); // lyon part dieu
export const path = writable<string[]>([]);

export const greenIcon = new L.Icon({
    iconUrl: icoGreen,
    shadowUrl: icoShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export const goldIcon = new L.Icon({
    iconUrl: icoGold,
    shadowUrl: icoShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export const normalIcon = new L.Icon({
    iconUrl: icoNormal,
    shadowUrl: icoShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
