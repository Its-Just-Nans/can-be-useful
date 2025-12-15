import { writable } from "svelte/store";

export const client = writable(null);
export const currentRoom = writable(null);
export const settings = writable({});
