import { writable } from "svelte/store";
import { myFetch } from "./utils";
import type { Parking } from "../../shared/types";

export const parkingList = writable<Parking[]>([]);

export const getParkings = () => {
    myFetch("/parkings").then((res) => {
        if (Array.isArray(res)) {
            parkingList.set(res);
        }
    });
};
