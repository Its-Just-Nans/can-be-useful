import { writable } from "svelte/store";
import type { Parking } from "../../../shared/types";

export const parkings = writable<Parking[]>([]);
export const macs = writable<string[]>([]);
export const carsIn = writable<string[]>([]);
export const carsOut = writable<string[]>([]);
