import { HOST } from "./constants";

let id = "";

function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}
export const start = () => {
    let idTemp = window.localStorage.getItem("id");
    if (!idTemp) {
        idTemp = makeid(64);
        window.localStorage.setItem("id", idTemp);
    }
    id = idTemp;
};

export const setFav = async (locations) => {
    const rep = await fetch(`${HOST}/api/locations?id=${id}`, {
        method: "POST",
        body: JSON.stringify(locations),
    });
    return rep.json();
};

export const getFav = async () => {
    const rep = await fetch(`${HOST}/api/locations?id=${id}`);
    return rep.json();
};
