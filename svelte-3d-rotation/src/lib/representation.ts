import { writable } from "svelte/store";

type TypeVertex = [number, number, number];

const orthogonal = (canvas: HTMLCanvasElement) => {
    const scale = canvas.width / 4;
    return {
        gx: (vertex: TypeVertex) => vertex[0] * scale,
        gy: (vertex: TypeVertex) => vertex[1] * scale,
    };
};
const oblique = (canvas: HTMLCanvasElement) => {
    const modelSize = canvas.width / 4;
    const scale = modelSize / 2;
    const zc = 0.2;
    return {
        gx: (vertex: TypeVertex) => (vertex[0] + vertex[2] * zc) * scale,
        gy: (vertex: TypeVertex) => (vertex[1] + vertex[2] * zc) * scale,
    };
};

const cavalier = (canvas: HTMLCanvasElement) => {
    const modelSize = canvas.width / 4;
    const scale = modelSize / 2;
    const angle = Math.PI / 6; // 30 degrees
    const a = Math.cos(angle);
    const b = Math.sin(angle);
    return {
        gx: (vertex: TypeVertex) => (vertex[0] + vertex[2] * a) * scale,
        gy: (vertex: TypeVertex) => (vertex[1] + vertex[2] * b) * scale,
    };
};
const cabinet =
    (typeCavalier = 1 / 2) =>
    (canvas: HTMLCanvasElement) => {
        const modelSize = canvas.width / 4;
        const scale = modelSize / 2;
        const angle = Math.PI / 6; // 30 degrees
        const a = Math.cos(angle) * typeCavalier;
        const b = Math.sin(angle) * typeCavalier;
        return {
            gx: (vertex: TypeVertex) => (vertex[0] + vertex[2] * a) * scale,
            gy: (vertex: TypeVertex) => (vertex[1] + vertex[2] * b) * scale,
        };
    };
const isometric = (canvas: HTMLCanvasElement) => {
    const modelSize = canvas.width / 4;
    const scale = modelSize / 2;
    const angle = Math.PI / 6; // 30 degrees
    const a = Math.cos(angle);
    const b = Math.sin(angle);
    return {
        gx: (vertex: TypeVertex) => (vertex[0] * a + vertex[2] * a) * scale,
        gy: (vertex: TypeVertex) => (vertex[1] + vertex[2] * b - vertex[0] * b) * scale,
    };
};

export const representation = {
    orthogonal,
    oblique,
    cavalier,
    cabinet1: cabinet(1 / 2),
    cabinet2: cabinet(2 / 3),
    isometric,
};

export const rpz = writable("orthogonal");
