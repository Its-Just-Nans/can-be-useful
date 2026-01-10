import { writable } from "svelte/store";

export const user = writable<{} | null>({});
export const settings = writable({ allowMove: true });

export const APP_NAME = "🇦 🇷 🇰 🇮 🇳 🇬";

export let API_URL = "/api";

export const getApiUrl = () => API_URL;

export const setApiUrl = (url: string) => (API_URL = url);

export const PREFIX_URL = window.location.pathname.includes("dist")
    ? "/dist/"
    : window.location.pathname.includes("rio203")
    ? "/rio203/"
    : "/";
