import { webSocketURL } from "../utils";
import { PLACES_STATES, JtoS, parseJSON } from "../../../shared/constants";

type handler = (data: {}, isMessage?: boolean) => void;

class SoftCaptor {
    socket: WebSocket | null = null;
    currentState = PLACES_STATES.FREE;
    placeId;
    handlers: handler[] = [];
    constructor(id: number) {
        this.placeId = id;
    }
    start() {
        this.socket = new WebSocket(webSocketURL);
        this.socket.addEventListener("message", (event) => {
            this.onMessage(event);
        });
    }
    isCar(value: boolean) {
        if (value) {
            this.currentState = PLACES_STATES.BUSY;
        } else {
            this.currentState = PLACES_STATES.FREE;
        }
        this.sendMessage({ request: "info", state: this.currentState });
    }
    sendMessage(msg: {}) {
        if (!this.socket) {
            return;
        }
        const dataToSend = { name: this.placeId.toString(), id: this.placeId, ...msg };
        this.handlers.forEach((oneHandler) => {
            oneHandler(dataToSend, true);
        });
        this.socket.send(JtoS(dataToSend));
    }
    addHandler(handler: handler) {
        this.handlers.push(handler);
    }
    onMessage(event: {}) {
        const data = parseJSON(event.data);
        this.handlers.forEach((handler) => {
            handler(data);
        });
        let dataToSend: null | {} = null;
        if (data.request === "name") {
            dataToSend = { response: "name" };
        }
        if (dataToSend) {
            this.sendMessage(dataToSend);
        }
    }
    destroy() {
        if (this.socket) {
            console.log("destroying soft captor socket");
            this.socket.close();
        }
    }
}

export default SoftCaptor;
