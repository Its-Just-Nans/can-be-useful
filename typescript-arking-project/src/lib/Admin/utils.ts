import { myFetch } from "../utils";
import { carsIn, carsOut, macs } from "./adminStore";

export const getMacs = async () => {
    myFetch("/macs").then((data) => {
        macs.set(data);
    });
};

let parkingIdSave = "";

export const getCarsIn = async (parkingId?: string) => {
    if (parkingId) {
        parkingIdSave = parkingId;
    } else {
        parkingId = parkingIdSave;
    }
    if (!parkingId) {
        return;
    }
    myFetch("/carsIn/" + parkingId).then((data) => {
        carsIn.set(data);
    });
};
export const getCarsOut = async (parkingId?: string) => {
    if (parkingId) {
        parkingIdSave = parkingId;
    } else {
        parkingId = parkingIdSave;
    }
    if (!parkingId) {
        return;
    }
    myFetch("/carsOut/" + parkingId).then((data) => {
        carsOut.set(data);
    });
};
