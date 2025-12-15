<script lang="ts">
    import { onMount } from "svelte";
    import { reverseTransformer } from "./utils";
    let canvas: HTMLCanvasElement;
    let c: CanvasRenderingContext2D;
    let width = 0;
    let height = 0;
    let rows = 0;
    let columns = 0;
    let i = 0;
    const updatePosition = (e) => {
        console.log(i++, e);
    };
    onMount(() => {
        const cf = canvas.getContext("2d");
        if (cf) {
            c = cf;
        }
        canvas.width = Math.floor(size * scale);
        canvas.height = Math.floor(size * scale);
        c.scale(scale, scale);
        setUp();
        animate();
    });

    var cubeSize = 2;
    const scale = window.devicePixelRatio;
    const size = 200;

    const setUp = () => {
        width = canvas.width;
        height = canvas.height;
        console.log(width, height, rows, columns);
    };

    var colors = ["#000", "#fff"];

    var animationSpeed = 1; // Adjust the speed of the animation
    var xOffset = 0;
    var yOffset = 0;

    addEventListener("resize", setUp);

    function drawCheckerboard() {
        c.clearRect(0, 0, width, height);

        const cols = Math.ceil(width / cubeSize) + 2;
        const rows = Math.ceil(height / cubeSize) + 2;

        const xStart = -xOffset % cubeSize;
        const yStart = -yOffset % cubeSize;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const gridY = Math.floor((i * cubeSize + yOffset) / cubeSize);
                const gridX = Math.floor((j * cubeSize + xOffset) / cubeSize);
                const colorIndex = (((gridY + gridX) % colors.length) + colors.length) % colors.length; // ensures positive modulo

                c.fillStyle = colors[colorIndex];
                c.fillRect(j * cubeSize + xStart, i * cubeSize + yStart, cubeSize, cubeSize);
            }
        }
    }
    let msg = "Hello world";
    let delay = 50;
    let state = "stop"; // or "left", "up", "down"

    function animate() {
        switch (state) {
            case "right":
                xOffset += animationSpeed;
                break;
            case "left":
                xOffset -= animationSpeed;
                break;
            case "up":
                yOffset -= animationSpeed;
                break;
            case "down":
                yOffset += animationSpeed;
                break;
            case "stop":
                xOffset = 0;
                yOffset = 0;
                break;
        }

        drawCheckerboard();
        requestAnimationFrame(animate);
    }
</script>

<div class="div">
    <canvas bind:this={canvas}></canvas>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />

    <br />
    <select bind:value={state}>
        <option value="right">Right</option>
        <option value="left">Left</option>
        <option value="up">Up</option>
        <option value="down">Down</option>
        <option value="stop">Stop</option>
    </select>
    <br />
    <input type="range" min="0" max="10" step="0.1" bind:value={animationSpeed} />
    {animationSpeed}
    <br />
    <button
        on:click={() => {
            cubeSize -= 0.1;
            cubeSize = Math.round(cubeSize * 10) / 10;
        }}>-</button
    >
    <input type="range" min="1" max="15" step="0.1" bind:value={cubeSize} />
    <button
        on:click={() => {
            cubeSize += 0.1;
            cubeSize = Math.round(cubeSize * 10) / 10;
        }}>+</button
    >
    {cubeSize}
    <br />
    <input type="text" bind:value={msg} />
    <button
        on:click={() => {
            const data = msg;
            // transform to binary
            const binary = data
                .split("")
                .map((char) => {
                    return char.charCodeAt(0).toString(2).padStart(8, "0");
                })
                .join("");
            // split by two characters
            const split = binary.match(/.{1,2}/g);
            console.log(split);
            let idx = 0;
            const send = () => {
                setTimeout(() => {
                    if (idx < split.length) {
                        state = reverseTransformer[split[idx]];
                        console.log(state);
                        idx++;
                        send();
                    } else {
                        state = "stop";
                    }
                }, delay);
            };
            send();
        }}>send</button
    >
</div>
<br />

<style>
    .div {
        /* display: flex;
        justify-content: center;
        align-items: center; */
        width: 100%;
        margin: auto;
    }
    canvas {
        display: block;
        width: 200px;
        height: 200px;
    }
</style>
