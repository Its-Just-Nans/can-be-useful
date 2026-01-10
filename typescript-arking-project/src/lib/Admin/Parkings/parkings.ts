import { myFetch } from "../../utils";
import { parkings } from "../adminStore";

export const getParkingsOfUser = () => {
    myFetch("/parkingsOfUser").then((res) => {
        if (Array.isArray(res)) {
            parkings.set(res);
        }
    });
};
