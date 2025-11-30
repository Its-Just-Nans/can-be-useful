import { writable } from "svelte/store";

export const content = writable("");
export const parsed = writable([]);
export const size = writable(0);
export const filename = writable("");
export const fileHandle = writable(null);
export const sidebar = writable(true);
