import { get } from "svelte/store";
import { rpz, representation } from "./representation";
import { rot, rotation } from "./rotation";
import { multiplyVecToMatrix } from "./utils";
import { drawAxisIndicator } from "./axis";

export class ObjectDrawer {
    constructor(faces) {
        this.faces = faces;
        this.fx = null;
        this.fy = null;
        this.matrix = null;
    }

    drawPolygon(canvas, polygon) {
        const context = canvas.getContext("2d");
        context.beginPath();
        polygon.forEach((vertex, index) => {
            const v = multiplyVecToMatrix(vertex, this.matrix);
            if (index == 0) {
                context.moveTo(this.fx(v), this.fy(v));
            } else {
                context.lineTo(this.fx(v), this.fy(v));
            }
        });
        context.closePath();
        context.stroke();
    }

    setMatrix(matrix) {
        this.matrix = matrix;
    }

    draw(renderer, canvas) {
        const rendering = renderer(canvas);
        this.fx = rendering.gx;
        this.fy = rendering.gy;

        for (const oneFace of this.faces) {
            this.drawPolygon(canvas, oneFace);
        }
    }
}

export const draw = (canvas) => {
    const vertices = [
        [-1.0, -1.0, -1.0], // Front-Bottom-Left
        [1.0, -1.0, -1.0], // Front-Bottom-Right
        [-1.0, -1.0, 1.0], // Rear-Bottom-Left
        [1.0, -1.0, 1.0], // Rear-Bottom-Right
        [-1.0, 1.0, -1.0], // Front-Top-Left
        [1.0, 1.0, -1.0], // Front-Top-Right
        [-1.0, 1.0, 1.0], // Rear-Top-Left
        [1.0, 1.0, 1.0], // Rear-Top-Right
    ];
    const faces = [
        [vertices[0], vertices[1], vertices[5], vertices[4]], // Front
        [vertices[2], vertices[3], vertices[7], vertices[6]], // Rear
        [vertices[0], vertices[1], vertices[3], vertices[2]], // Bottom
        [vertices[4], vertices[5], vertices[7], vertices[6]], // Top
        [vertices[0], vertices[2], vertices[6], vertices[4]], // Left
        [vertices[1], vertices[3], vertices[7], vertices[5]], // Right
    ];

    const obj = new ObjectDrawer(faces);
    const render = (timestamp) => {
        const context = canvas.getContext("2d");
        context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        const currentRotation = rotation[get(rot)];

        const angle = (Math.PI * timestamp) / 20 / 128;
        const rotationMatrix = currentRotation(angle);
        obj.setMatrix(rotationMatrix);
        const currentRepresentation = representation[get(rpz)];
        obj.draw(currentRepresentation, canvas);
        if (get(rot) !== "none") {
            drawAxisIndicator(context, rotationMatrix);
        }
        window.requestAnimationFrame(render);
    };
    return render;
};
