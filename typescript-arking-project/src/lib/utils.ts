import { ERRORS } from "../../shared/errors";
import { getApiUrl } from "./stores";

const isHttps = window.location.protocol === "https:";
export const webSocketURL = `${isHttps ? "wss" : "ws"}://${window.location.host}/api`;

export const myFetch = (url: string, method = "GET", body?: object) => {
    return fetch(getApiUrl() + url, {
        body: JSON.stringify(body) ?? undefined,
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    }).then((res) => res.json());
};
let token = "";

export const setToken = (newToken: string) => {
    token = newToken;
};
export const getToken = () => token;

type Error = {
    code: string;
    error: string;
};

type MayBeError = Error | {};

export const handleErrors = (res: MayBeError, callback?: () => void) => {
    for (const oneError of Object.values(ERRORS)) {
        if ("code" in res && "error" in res) {
            if (res.code === oneError.code) {
                return res.error;
            }
        }
    }
    if (callback) {
        return callback();
    }
    return "";
};
