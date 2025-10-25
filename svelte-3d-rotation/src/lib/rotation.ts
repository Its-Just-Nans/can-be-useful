import { writable, get } from "svelte/store";

const rotationX = (angle: number) => {
    return [1, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle)];
};
const rotationY = (angle: number) => {
    return [Math.cos(angle), 0, Math.sin(angle), 0, 1, 0, -Math.sin(angle), 0, Math.cos(angle)];
};
const rotationZ = (angle: number) => {
    return [Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1];
};
// const getIsometric = () => {
//     const angle = Math.PI / 6;
//     const a = Math.cos(angle);
//     const b = Math.sin(angle);
//     return [a, 0, a, -b, 1, b, 0, 0, 0];
// };

export const rotation = {
    none: () => [1, 0, 0, 0, 1, 0, 0, 0, 1], // identity matrix
    rotationX,
    rotationY,
    rotationZ,
    // getIsometric,
    reactive: () => {
        return get(reactiveMatrix);
    },
};

export const rot = writable(Object.keys(rotation)[4]);

export const reactiveMatrix = writable<number[]>(rotation["none"]());
