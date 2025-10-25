import { writable } from "svelte/store";

type NotVector3 = { x: number; z: number };

type positionByAxisType = {
    [axisNumber: number]: NotVector3;
};

const positionByAxis: positionByAxisType = {};

export const setPosition = (axisNumber: number, position: NotVector3) => {
    positionByAxis[axisNumber] = position;
};

export const getPosition = (axisNumber: number) => positionByAxis[axisNumber];

export const radius = writable(1.5);
export const rotation = writable(0);
export const diskHeight = writable(0.5);
export const speed = writable(0.1);
export const movement = writable(0.1);
export const control = writable(true);
export const coords = writable({
    x2: 0,
    z2: 0,
    x3: 0,
    z3: 0,
});

export const circleIntersection = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) => {
    // Calculate the distance between the two centers
    const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // Check for no intersection or one circle inside the other
    if (d > r1 + r2 || d < Math.abs(r1 - r2)) {
        return [null, null]; // No intersection
    }

    // Check for concentric circles
    if (d === 0 && r1 === r2) {
        return [
            { x: x2, y: y2 },
            { x: x2, y: y2 },
        ]; // infinite
    }

    // Calculate the intersection points
    const a = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d);
    const h = Math.sqrt(r1 ** 2 - a ** 2);

    const x3 = x1 + (a * (x2 - x1)) / d;
    const y3 = y1 + (a * (y2 - y1)) / d;

    // Calculate intersection points
    const intersection1 = {
        x: x3 + (h * (y2 - y1)) / d,
        y: y3 - (h * (x2 - x1)) / d,
    };

    const intersection2 = {
        x: x3 - (h * (y2 - y1)) / d,
        y: y3 + (h * (x2 - x1)) / d,
    };

    return [intersection1, intersection2];
};

export type ChangedType = {
    [s: string]: () => [number, number];
};

type InfoType = {
    key: string;
    radius: number;
    movement: number;
};

type DataType = {
    x2: number;
    z2: number;
    x3: number;
    z3: number;
};

export const onKeyDown = ({ key, radius, movement }: InfoType, { x2, z2, x3, z3 }: DataType) => {
    const changed: ChangedType = {
        ArrowUp: () => [0, -movement],
        ArrowDown: () => [0, movement],
        ArrowLeft: () => [-movement, 0],
        ArrowRight: () => [movement, 0],
    };
    if (!changed[key]) {
        return;
    }
    const [x, y] = changed[key]();
    const [newPos, newPos2] = circleIntersection(0, 0, radius, x3 + x, z3 + y, radius);
    if (newPos || newPos2) {
        if (newPos) {
            x2 = newPos.x;
            z2 = newPos.y;
        } else if (newPos2) {
            x2 = newPos2.x;
            z2 = newPos2.y;
        }
        x3 += x;
        z3 += y;
        setPosition(2, { x: x2, z: z2 });
        setPosition(3, { x: x3, z: z3 });
        coords.set({ x2, z2, x3, z3 });
    }
};
