import { writable } from "svelte/store";
import { reactiveMatrix, rotation } from "./rotation";

export const reactive = writable<boolean>(true);

export const multiplyMatrices = (a: number[], b: number[]) => {
    const result: number[] = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let sum = 0;
            for (let k = 0; k < 3; k++) {
                sum += a[i * 3 + k] * b[k * 3 + j];
            }
            result[i * 3 + j] = sum;
        }
    }
    return result;
};

let canvas: HTMLCanvasElement;
let cx = 0.001;
let cy = 0.001;
let lx = 0;
let ly = 0;
let x = 0;
let y = 0;
let decay = 0.98;

const move = function (e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const mouseX = e.type === "mousemove" ? (e as MouseEvent).pageX : (e as TouchEvent).touches[0].pageX;
    const mouseY = e.type === "mousemove" ? (e as MouseEvent).pageY : (e as TouchEvent).touches[0].pageY;
    const canvasX = canvas.offsetLeft;
    const canvasY = canvas.offsetTop;
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    const px = (mouseX - canvasX) / canvasWidth;
    const py = (mouseY - canvasY) / canvasHeight;
    if (lx && ly) {
        cx = px - lx;
        cy = py - ly;
    }
    lx = px;
    ly = py;
    cx *= decay;
    cy *= decay;
    x -= cx;
    y += cy;
    const newReactive = multiplyMatrices(rotation.rotationX(-y * 2 * Math.PI), rotation.rotationY(x * 2 * Math.PI));
    reactiveMatrix.set(newReactive);
};

const leave = function () {
    lx = 0;
    ly = 0;
};
export const setUpEvents = (canvasRef: HTMLCanvasElement) => {
    canvas = canvasRef;
    window.addEventListener("mousemove", move, false);
    window.addEventListener("touchmove", move, false);

    window.addEventListener("mouseleave", leave, false);
    window.addEventListener("touchend", leave, false);
};

export const removeEvents = () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("touchmove", move);

    window.removeEventListener("mouseleave", leave);
    window.removeEventListener("touchend", leave);
};

export const multiplyVecToMatrix = (vector: number[], matrix: number[]) => {
    const elements = [];
    for (let y = 0; y < 3; ++y) {
        let sum = 0;
        for (let x = 0; x < 3; ++x) {
            const index = x + y * 3;
            sum += vector[x] * matrix[index];
        }
        elements.push(sum);
    }
    return elements;
};
