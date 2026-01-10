import { get } from "svelte/store";
import type { Place } from "../../../shared/types";
import { PLACES_STATES, PLACES_TYPES } from "../../../shared/constants";
import { myFetch } from "../utils";
import { parkingReloader, places, editMode as editModeStore } from "./stores";

const COLOR_MAP = {
    [PLACES_STATES.FREE]: "#00ff00",
    [PLACES_STATES.BUSY]: "#ff0000",
    [PLACES_STATES.RESERVED]: "#f38d21",
    [PLACES_TYPES.CAR]: "#00e30a",
    [PLACES_TYPES.MOTORCYCLE]: "#6ce39d",
    [PLACES_TYPES.ELECTRIC]: "#0000ff",
    [PLACES_TYPES.ROAD]: "#9d9d9d",
};

export const generateParking = () => {
    let total = 0;
    let placesTotal: Place[] = [];
    const width = gridSize * 5;
    const height = gridSize * 3;
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const a = x * width;
            const b = y * height;
            placesTotal.push({
                selected: false,
                plaque: "",
                ip: "",
                name: "",
                state: PLACES_STATES.FREE,
                time: 0,
                a1: [a, b],
                a2: [a + width, b],
                a3: [a + width, b + height],
                a4: [a, b + height],
                typePlace: PLACES_TYPES.CAR,
            });
        }
        total += gridSize * 2;
    }
    return placesTotal;
};

const gridSize = 15;

export class Parking {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    clicked = false;
    adminMode = false;
    parkingId: string;
    editMode = false;

    constructor(parkingId: string, adminMode = false, editMode = false) {
        this.adminMode = adminMode;
        this.parkingId = parkingId;
        this.editMode = editMode;
        parkingReloader.subscribe((val) => {
            const { idPlace } = val;
            if (typeof idPlace === "number") {
                const isCorrectPlace = get(places).find((place) => place.idPlace === idPlace);
                if (isCorrectPlace?.idParking) {
                    this.loadParking(isCorrectPlace.idParking.toString());
                }
            } else {
                this.loadParking(this.parkingId);
            }
        });
        editModeStore.subscribe((newEditMode) => {
            this.setEditMode(newEditMode);
        });
        this.loadParking(parkingId);
    }

    start(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.setUpEvent();
    }

    setEditMode = (newEdit: boolean) => {
        this.editMode = newEdit;
        if (this.canvas) {
            this.removeEvent();
            this.setUpEvent();
        }
        // reset the place selection
        places.update((currVal) => {
            const newPlaces = currVal.map((onePlace) => {
                onePlace.selected = false;
                return onePlace;
            });
            return [...newPlaces];
        });
        this.drawParking();
    };

    removeEvent = () => {
        const oldCanvas = this.canvas.cloneNode(true);
        this.canvas.replaceWith(oldCanvas);
        this.canvas = oldCanvas as HTMLCanvasElement;
        const ctxx = this.canvas.getContext("2d");
        if (ctxx) {
            this.ctx = ctxx;
        }
    };

    setUpEvent = () => {
        this.canvas.addEventListener("click", (ev) => this.handleClick(ev));
        if (this.adminMode && this.editMode) {
            this.canvas.addEventListener("mousemove", (ev) => this.handleMove(ev));
            this.canvas.addEventListener("mousedown", (ev) => this.setClick());
            this.canvas.addEventListener("mouseup", (ev) => this.setNotClick());
        }
    };

    loadParking = async (idParking: string) => {
        const placesOfParking = await myFetch(`/places/${idParking}`);
        const parkingInfo = await myFetch(`/parking/${idParking}`);
        const { places: schemaPlaces, height, width } = JSON.parse(parkingInfo.schema);
        if (!Array.isArray(schemaPlaces)) {
            this.canvas.width = 0;
            this.canvas.height = 0;
        }
        places.set(
            placesOfParking.map((place: Place) => {
                const correctPlace = schemaPlaces.find((onePlace: Place) => onePlace.idPlace === place.idPlace);
                return {
                    ...correctPlace,
                    ...place,
                };
            })
        );
        this.canvas.width = width;
        this.canvas.height = height;
        this.drawParking();
    };

    setClick = () => {
        this.clicked = true;
    };
    setNotClick = () => {
        this.clicked = false;
    };

    handleClick = (event: any) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.clickOnPlace(x, y);
    };

    handleMove = (event: any) => {
        if (this.clicked) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.clickOnPlace(x, y, "move");
        }
    };

    shadeColor = (color: string, percent: number) => {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);

        R = (R * (100 + percent)) / 100;
        G = (G * (100 + percent)) / 100;
        B = (B * (100 + percent)) / 100;

        R = R < 255 ? R : 255;
        G = G < 255 ? G : 255;
        B = B < 255 ? B : 255;

        R = Math.round(R);
        G = Math.round(G);
        B = Math.round(B);

        let RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
        let GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
        let BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

        return "#" + RR + GG + BB;
    };

    drawParking = () => {
        const p = get(places);
        console.log("drawParking", p.length);
        if (this.canvas && this.ctx) {
            for (const onePlace of p) {
                this.drawPlace(onePlace);
            }
        }
    };

    drawPlace = (place: Place) => {
        const { a1, a2, a3, a4, state, selected, typePlace } = place;
        if (state === PLACES_STATES.FREE) {
            this.ctx.fillStyle = COLOR_MAP[typePlace] ?? "#00ff00";
        } else if (state === PLACES_STATES.RESERVED) {
            console.log("RESER");
            this.ctx.fillStyle = COLOR_MAP[state];
        } else {
            this.ctx.fillStyle = COLOR_MAP[state] ?? "#ff0000";
        }
        if (selected) {
            this.ctx.fillStyle = this.shadeColor(this.ctx.fillStyle, -50);
        }
        this.ctx.beginPath();
        this.ctx.moveTo(a1[0], a1[1]);
        this.ctx.lineTo(a2[0], a2[1]);
        this.ctx.lineTo(a3[0], a3[1]);
        this.ctx.lineTo(a4[0], a4[1]);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();
    };

    isPointInsideTriangle = (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number
    ) => {
        // Calculate barycentric coordinates
        const detT = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
        const alpha = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / detT;
        const beta = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / detT;
        const gamma = 1 - alpha - beta;

        // Check if the point is inside the triangle
        return alpha > 0 && beta > 0 && gamma > 0;
    };

    clickOnPlace = (x: number, y: number, name = "click") => {
        const pla = get(places);
        const correctPlaceIndex = pla.findIndex((onePlace) => {
            const { a1, a2, a3, a4 } = onePlace;
            if (x >= a1[0] && x <= a3[0] && y >= a1[1] && y <= a3[1]) {
                const c1 = [a1[0] + (a4[0] - a1[0]), a1[1]];
                const c2 = [a3[0] - (a4[0] - a1[0]), a3[1]];
                if (x >= c1[0] && x <= c2[0] && y >= a1[1] && y <= a3[1]) {
                    return true;
                } else if (this.isPointInsideTriangle(x, y, a1[0], a1[1], c1[0], c1[1], a4[0], a4[1])) {
                    return true;
                } else if (this.isPointInsideTriangle(x, y, a2[0], a2[1], a3[0], a3[1], c2[0], c2[1])) {
                    return true;
                }
                return false;
            }
        });

        if (correctPlaceIndex > -1) {
            if (this.editMode) {
                places.update((currVal) => {
                    if (name === "click") {
                        currVal[correctPlaceIndex].selected = !currVal[correctPlaceIndex].selected;
                    } else if (name === "move") {
                        currVal[correctPlaceIndex].selected = true;
                    }
                    return [...currVal];
                });
            } else {
                places.update((currVal) => {
                    const oldSelected = currVal[correctPlaceIndex].selected;
                    const newPlaces = currVal.map((onePlace) => {
                        onePlace.selected = false;
                        return onePlace;
                    });
                    newPlaces[correctPlaceIndex].selected = !oldSelected;
                    return [...newPlaces];
                });
            }
            this.drawParking();
        }
    };
}
