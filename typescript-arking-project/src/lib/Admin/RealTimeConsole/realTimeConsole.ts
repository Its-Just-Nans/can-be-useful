import { webSocketURL } from "../../utils";
import { user } from "../../stores";
import { parseJSON, JtoS } from "../../../../shared/constants";
import { writable, get } from "svelte/store";
import { getCarsIn, getCarsOut, getMacs } from "../utils";
import { parkingReloader } from "../../OneParking/stores";

let socket: null | WebSocket = null;

export const loadSocket = () => {
    socket = new WebSocket(webSocketURL);
    socket.addEventListener("message", handlerMsg);
    socket.addEventListener("close", function (event) {
        addMsg("Socket closed", true);
        loadSocket();
    });
};

const handlerMsg = (event) => {
    const { request, ...data } = parseJSON(event.data);
    console.log("admin socket", request, data);
    if (request === "name") {
        if (socket) {
            socket.send(JtoS({ response: "name", name: get(user).name, isAdmin: true }));
        }
    } else if (request === "info") {
        addMsg(data.info);
    } else if (request === "reload") {
        const { name } = data;
        console.log("reload", name);
        if (name === "parking") {
            const { idPlace } = data;
            parkingReloader.set({ idPlace });
        } else if (name === "macs") {
            // reload macs
            getMacs();
        } else if (name === "cars") {
            // reload cars list
            getCarsIn();
            getCarsOut();
        }
    }
};

export const msgs = writable<{}[]>([]);

export const closeSocket = () => {
    if (socket) {
        socket.close();
    }
};

const addMsg = (newMsg: {}, replace = false) => {
    if (replace) {
        msgs.set([newMsg]);
        return;
    }
    msgs.set([...get(msgs), newMsg]);
    setTimeout(() => {
        const el = document.getElementById("logger-admin");
        if (el) {
            el.scrollTo(0, el.scrollHeight);
        }
    }, 200);
};
