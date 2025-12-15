import { get, writable } from "svelte/store";

export const fromLocalStorage = (key, defaultValue) => {
    const json = localStorage.getItem(key);
    if (json) {
        return JSON.parse(json);
    }
    return defaultValue;
};

let cartId;

export const OVH_API = "https://eu.api.ovh.com/v1/";
export const getCartId = () => cartId;
export const setCartId = (c) => (cartId = c);

export const saveLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const results = writable({});
export const selected = writable(fromLocalStorage("selected-extensions", []));

const getProxyUrl = () => {
    const proxyUrl = get(proxy);
    if (!proxyUrl) {
        return "";
    }
    if (proxyUrl.endsWith("/")) {
        return proxyUrl;
    }
    return `${proxyUrl}/`;
};

export const getDomain = (domain, cartId) => {
    const urlProxy = getProxyUrl();
    const url = `${urlProxy}${OVH_API}order/cart/${cartId}/domain?domain=${domain}`;
    return fetch(url, {
        headers: {
            Authorization: get(authorization),
        },
    }).then(async (resp) => {
        const decoded = await resp.json();
        results.update((currResults) => {
            return {
                ...currResults,
                [domain]:
                    decoded.length === 0
                        ? [
                              {
                                  action: "unavailable",
                                  prices: [],
                              },
                          ]
                        : decoded,
            };
        });
    });
};

export const authorization = writable(fromLocalStorage("authorization", ""));

authorization.subscribe((value) => {
    saveLocalStorage("authorization", value);
});
export const proxy = writable(fromLocalStorage("proxy", ""));

proxy.subscribe((value) => {
    saveLocalStorage("proxy", value);
});
