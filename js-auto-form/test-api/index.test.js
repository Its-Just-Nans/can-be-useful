const fs = require('fs');
const FormData = require('form-data');
const axios = require("axios");
const URL = "http://localhost:3000";

let token = "";
const fetchData = (obj = {}) => {
    if (token) {
        if (!obj.headers) {
            obj.headers = {};
        }
        if (!obj.headers["Authorization"]) {
            obj.headers["Authorization"] = `Bearer ${token}`;
        }
    }
    return axios(obj);
}

const server = require("../auto-form-app/api/server");

test('Test si le serveur est en ligne', () => {
    return fetchData({ url: `${URL}` }).then(data => {
        expect(data.status).toBe(200);
        expect(data.data).toMatch("<!DOCTYPE html>");
    })
});


test('Test /api/isOpen', () => {
    return fetchData({
        url: `${URL}/api/isOpen`,
        method: "POST"
    }).catch(resp => {
        expect(resp.response.status).toBe(403);
        expect(resp.response.data).toBe("Forbidden");
    })
});

test('Test /api/open - not auth', () => {
    return fetchData({
        url: `${URL}/api/open`,
        method: "POST"
    }).catch(resp => {
        expect(resp.response.status).toBe(403);
        expect(resp.response.data).toBe("Forbidden");
    })
});

test('Test /api/setFile - not auth', () => {
    var form = new FormData();
    const file = fs.createReadStream('./temp.txt');
    form.append('uploaded', file, {
        filename: 'temp.tx',
        filepath: '/temp.txt',
        contentType: 'text/plain',
        knownLength: fs.statSync("./temp.txt").size
    });
    return fetchData({
        url: `${URL}/api/setFile`,
        method: "POST",
        data: form,
        headers: {
            ...form.getHeaders(),
            "Content-Length": form.getLengthSync(),
        },
    }).catch(resp => {
        expect(resp.response.status).toBe(403);
        expect(resp.response.data).toBe("Forbidden");
    })
});

test('Test /login - no body', () => {
    return fetchData({
        url: `${URL}/login`,
        method: "POST"
    }).catch(resp => {
        expect(resp.response.status).toBe(400);
        expect(resp.response.data.infos.code).toBe("NO_PASSWORD");
    })
});

test('Test /login', () => {
    return fetchData({
        url: `${URL}/login`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            password: "PASSWORD",
        })
    }).then(resp => {
        expect(resp.status).toBe(200);
        expect(typeof resp.data.data).toBe("string");
        token = resp.data.data;
    })
});

test('Test /api/isOpen', () => {
    return fetchData({
        url: `${URL}/api/isOpen`,
        method: "POST"
    }).then(resp => {
        expect(resp.status).toBe(200);
        expect(resp.data.data).toBe(false);
    })
});

test('Test /api/isOpen - with bad token', () => {
    const tokenSave = token;
    token = "A_BAD_TOKEN";
    return fetchData({
        url: `${URL}/api/isOpen`,
        method: "POST"
    }).catch(resp => {
        expect(resp.response.status).toBe(403);
        expect(resp.response.data).toBe("Forbidden");
        token = tokenSave;
    })
});

test('Test /api/isOpen - with bad header', () => {
    return fetchData({
        url: `${URL}/api/isOpen`,
        method: "POST",
        headers: {
            Authorization: "TOTO"
        }
    }).catch(resp => {
        expect(resp.response.status).toBe(400);
        expect(resp.response.data.infos.code).toBe("BAD_HEADER");
    })
});

test('Test /api/open', () => {
    return fetchData({
        url: `${URL}/api/open`,
        method: "POST"
    }).then(resp => {
        expect(resp.status).toBe(200);
        expect(resp.data.data).toBe(true);
    })
});

test('Test /api/open', () => {
    return fetchData({
        url: `${URL}/api/open`,
        method: "POST"
    }).catch(resp => {
        expect(resp.response.status).toBe(400);
        expect(resp.response.data.data).toBe(null);
        expect(resp.response.data.infos.code).toBe("DB_ALREADY_OPEN");
    })
});

test('Test /api/getData', () => {
    return fetchData({
        url: `${URL}/api/getData`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "name": "toto",
        })
    }).then(resp => {
        expect(resp.status).toBe(200);
        expect(resp.data.data).toBe("TODO"); // TODO
    })
});

test('Test /api/getData - without body', () => {
    return fetchData({
        url: `${URL}/api/getData`,
        method: "POST",
    }).catch(resp => {
        expect(resp.response.status).toBe(400);
        expect(resp.response.data.infos.code).toBe("EMPTY_BODY");
    })
});


test('Test /api/setData', () => {
    return fetchData({
        url: `${URL}/api/setData`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "name": "toto",
            "value": 'lol'
        })
    }).then(resp => {
        expect(resp.status).toBe(200);
        expect(resp.data.data).toBe(true); // TODO
    })
});

test('Test /api/setData - whitout body', () => {
    return fetchData({
        url: `${URL}/api/setData`,
        method: "POST",
    }).catch(resp => {
        expect(resp.response.status).toBe(400);
        expect(resp.response.data.infos.code).toBe("EMPTY_BODY");
    })
});

test('Test /api/setFile', () => {
    var form = new FormData();
    const file = fs.createReadStream('./temp.txt');
    form.append('uploaded', file, {
        filename: 'temp.tx',
        filepath: '/temp.txt',
        contentType: 'text/plain',
        knownLength: fs.statSync("./temp.txt").size
    });
    return fetchData({
        url: `${URL}/api/setFile`,
        method: "POST",
        data: form,
        headers: {
            ...form.getHeaders(),
            "Content-Length": form.getLengthSync(),
        },
    }).then(resp => {
        expect(resp.status).toBe(200);
        expect(resp.data.data).toBe(true);
    })
});

test('Test /api/setFile - wrong', () => {
    var form = new FormData();
    form.append('toto', "tata");
    return fetchData({
        url: `${URL}/api/setFile`,
        method: "POST",
        data: form,
        headers: {
            ...form.getHeaders(),
            "Content-Length": form.getLengthSync(),
        },
    }).catch(resp => {
        expect(resp.response.status).toBe(400);
        expect(resp.response.data.data).toBe(false);
    })
});

test('Test /api/close', () => {
    return fetchData({
        url: `${URL}/api/close`,
        method: "POST"
    }).then((resp) => {
        expect(resp.status).toBe(200);
        expect(resp.data.data).toBe(true);
    });
});

test('Test /api/isOpen when DB is closed', () => {
    return fetchData({
        url: `${URL}/api/isOpen`,
        method: "POST"
    }).then(resp => {
        expect(resp.status).toBe(200);
        expect(resp.data.data).toBe(false);
    })
});

test('Test /api/setFile when DB is closed', () => {
    var form = new FormData();
    const file = fs.createReadStream('./temp.txt');
    form.append('uploaded', file, {
        filename: 'temp.tx',
        filepath: '/temp.txt',
        contentType: 'text/plain',
        knownLength: fs.statSync("./temp.txt").size
    });
    return fetchData({
        url: `${URL}/api/setFile`,
        method: "POST",
        data: form,
        headers: {
            ...form.getHeaders(),
            "Content-Length": form.getLengthSync(),
        },
    }).catch(resp => {
        expect(resp.response.status).toBe(400);
        expect(resp.response.data.infos.code).toBe("DB_NOT_OPEN");
    })
});

test('Close server', () => {
    server.server.close();
});