import { multiplyVecToMatrix } from "./utils";

export const drawAxisIndicator = (context: CanvasRenderingContext2D, matrix: number[]) => {
    context.save();

    context.textBaseline = "middle";
    context.textAlign = "center";

    context.strokeStyle = "#F06";
    context.fillStyle = "#F06";

    const x = multiplyVecToMatrix([30.0, 0.0, 0.0], matrix);
    context.fillText("X", x[0], x[1]);
    drawLineFromVectors(
        context,
        multiplyVecToMatrix([0.0, 0.0, 0.0], matrix),
        multiplyVecToMatrix([20.0, 0.0, 0.0], matrix)
    );

    context.strokeStyle = "#F90";
    context.fillStyle = "#F90";

    const y = multiplyVecToMatrix([0.0, 30.0, 0.0], matrix);
    context.fillText("Y", y[0], y[1]);
    drawLineFromVectors(
        context,
        multiplyVecToMatrix([0.0, 0.0, 0.0], matrix),
        multiplyVecToMatrix([0.0, 20.0, 0.0], matrix)
    );

    context.strokeStyle = "#09C";
    context.fillStyle = "#09C";

    const z = multiplyVecToMatrix([0.0, 0.0, 30.0], matrix);
    context.fillText("Z", z[0], z[1]);
    drawLineFromVectors(
        context,
        multiplyVecToMatrix([0.0, 0.0, 0.0], matrix),
        multiplyVecToMatrix([0.0, 0.0, 20.0], matrix)
    );

    context.restore();
    function drawLineFromVectors(context: CanvasRenderingContext2D, a: number[], b: number[]) {
        context.beginPath();
        context.moveTo(a[0], a[1]);
        context.lineTo(b[0], b[1]);
        context.stroke();
    }
};
