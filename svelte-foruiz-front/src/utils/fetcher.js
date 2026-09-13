let token = null;
let refreshToken = null;

const setToken = (newToken) => {
    token = newToken;
};
export const setRefreshToken = (newToken) => {
    refreshToken = newToken;
};
export const getRefreshToken = (newToken) => {
    return refreshToken;
};

export const getToken = () => {
    return token;
};

export const isToken = () => {
    return token !== null;
};

const fetcher = async (method = "POST", url, data = null, parse = false, currentToken = null) => {
    const jsonType = true;
    const info = {
        method,
        headers: {},
    };
    if (currentToken) {
        info.headers["Authorization"] = `Bearer ${currentToken}`;
    }
    if (data && method !== "GET") {
        if (!jsonType) {
            info.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
            info.body = Object.entries(data)
                .map(([k, v]) => `${k}=${v}`)
                .join("&");
        } else {
            info.headers["Content-Type"] = "application/json";
            info.body = JSON.stringify(data);
        }
    }
    if (window && typeof window.debug !== "undefined" && window.debug) {
        console.log(url);
    }
    let result;
    try {
        result = await fetch(url, info);
    } catch (e) {
        e = result;
    }
    let finalRes = { data: null, infos: null };
    if (parse) {
        try {
            finalRes = await result.json();
            if (finalRes && finalRes.data && finalRes.infos) {
                return { data: finalRes.data, infos: finalRes.infos };
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.info("Can't parse JSON");
            }
        }
        if (typeof finalRes === "object" && result && result.status === 401) {
            if (!finalRes.infos) {
                finalRes.infos = {};
            }
            finalRes.infos.needAuth = true;
        }
    }
    return finalRes;
};

const fetcherP = async (method, url, data = null, auth = true) => {
    return await fetcher(method, url, data, true, auth ? token : null);
};

export { fetcher, fetcherP, setToken };
