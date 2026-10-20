let token = "";

export const setToken = (newToken) => {
    token = newToken;
};

export const ping = async () => {
    let ans;
    await fetch("http://localhost:3000/api/isOpen", {
        method: "post",
    })
        .then(async (data) => {
            ans = await data.json();
        })
        .catch(() => {
            ans = null;
        });
    return ans;
};

export const sendForm = async (data) => {
    let ans;
    await fetch("http://localhost:3000/api/sendForm", {
        method: "post",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(async (data) => {
            ans = await data.json();
        })
        .catch(() => {
            ans = null;
        });
    return ans;
};

const login = async (data) => {
    let ans;
    await fetch("http://localhost:3000/login", {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: data,
    })
        .then(async (data) => {
            ans = await data.json();
        })
        .catch(async (data) => {
            ans = {};
        });
    return ans;
};

export const log = async () => {
    const result = await chrome.storage.local.get("password");
    if (!result || !result.password) {
        throw "NO_PASS";
    }
    const res = await login(JSON.stringify({ password: result.password }));
    return res;
};
