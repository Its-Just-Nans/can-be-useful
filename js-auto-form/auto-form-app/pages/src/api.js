let access_token = "";

import { URL_SERVER } from "./url";

const getPassword = () => {
    if (window && window.localStorage && window.localStorage.getItem("password")) {
        return window.localStorage.getItem("password");
    } else {
        return null;
    }
};

export const saveData = async (list) => {
    for (const oneElement of list) {
        if (oneElement.type === "file") {
            await setFile(oneElement.value, oneElement.name, oneElement.fileName || oneElement.name);
        } else {
            await setData(
                JSON.stringify({
                    name: oneElement.name,
                    value: oneElement.value,
                    keywords: oneElement.keywords,
                })
            );
        }
    }
};

export const setPassword = (password) => {
    if (window && window.localStorage) {
        window.localStorage.setItem("password", password);
    }
};

export const setData = async (body) => {
    const data = await fetch(`${URL_SERVER}/api/setData`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        method: "POST",
        body: body,
    });
    return await data.json();
};

export const getData = async (body) => {
    const data = await fetch(`${URL_SERVER}/api/getData`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        method: "POST",
        body: body,
    });
    return await data.json();
};

export const login = () => {
    const pass = getPassword();
    if (pass) {
        return fetch(`${URL_SERVER}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: pass,
            }),
        })
            .then(async (resp) => {
                const json = await resp.json();
                if (json.data !== null) {
                    access_token = json.data;
                    await openDB();
                } else {
                    throw "BAD_PASSWORD";
                }
            })
            .catch(() => {
                throw "ERROR";
            });
    } else {
        throw "NO_PASS";
    }
};

export const openDB = async () => {
    const data = await fetch(`${URL_SERVER}/api/open`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        method: "POST",
    });
    return await data.json();
};

export const setFile = async (body, nameOfField = "", nameOfFile = "") => {
    const data = await fetch(`${URL_SERVER}/api/setFile`, {
        headers: {
            "Content-Disposition": `attachment;fieldname=${nameOfField};filename=${nameOfFile}`,
            Authorization: `Bearer ${access_token}`,
        },
        method: "POST",
        body: body,
    });
    return await data.json();
};

export const isFile = async (fieldName) => {
    const data = await fetch(`${URL_SERVER}/api/isFile`, {
        headers: {
            "Content-Disposition": `attachment;fieldname=${nameOfField};filename=${nameOfFile}`,
            Authorization: `Bearer ${access_token}`,
        },
        method: "POST",
        body: body,
    });
    return await data.json();
};

export const getFile = async (fieldName) => {
    const resp = await fetch(`${URL_SERVER}/api/getFile`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        method: "POST",
        body: JSON.stringify({
            path: fieldName,
        }),
    });
    const name = resp.headers.get("Content-disposition").split("filename=")[1] || "temp";
    const b = await resp.blob();
    var url = window.URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
};

export const startDrag = async () => {
    await fetch(`${URL_SERVER}/api/electron/startDrag`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        method: "POST",
    });
};
