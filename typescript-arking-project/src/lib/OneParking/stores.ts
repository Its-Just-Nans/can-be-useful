import { writable } from "svelte/store";
import type { Place } from "../../../shared/types";

export const editMode = writable(false);
export const view3d = writable(false);
export const places = writable<Place[]>([]);
export const parkingReloader = writable({});
