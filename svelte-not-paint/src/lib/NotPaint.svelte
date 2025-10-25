<script>
    import { onMount } from "svelte";
    let oldx = 0;
    let oldy = 0;
    let canvas;
    let draw = false;
    let ctx;
    const move = (e) => {
        const y = e.pageY - 40; // remove header height
        if (!draw) {
            oldx = e.pageX;
            oldy = y;
            return;
        }

        ctx.beginPath();
        ctx.moveTo(oldx, oldy);
        ctx.lineTo(e.pageX, y);
        ctx.stroke();
        oldx = e.pageX;
        oldy = y;
    };

    let color = "#000000";
    const download = () => {
        const type = "png" || "jpeg" || "webp" || "bmp";
        const imgData = canvas.toDataURL(`image/${type}`);
        const downloadLink = document.createElement("a");
        downloadLink.href = imgData;
        downloadLink.download = "canvas_image.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
    window.download = download;

    const setDraw = () => {
        draw = true;
    };
    const stopDraw = () => {
        draw = false;
    };

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 40;
    };

    onMount(() => {
        ctx = canvas.getContext("2d");
        // ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = color;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 40;
        canvas.addEventListener("mousemove", move);
        document.addEventListener("mouseup", stopDraw);
        document.addEventListener("mousedown", setDraw);
        document.addEventListener("touchmove", move);
        document.addEventListener("touchstart", setDraw);
        document.addEventListener("touchend", stopDraw);
        window.addEventListener("resize", resize);
        return () => {
            canvas.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", stopDraw);
            document.removeEventListener("mousedown", setDraw);
            document.removeEventListener("touchmove", move);
            document.removeEventListener("touchstart", setDraw);
            document.removeEventListener("touchend", stopDraw);
            window.removeEventListener("resize", resize);
        };
    });
</script>

<div class="notpaint">
    <div class="header">
        <div>NotPaint</div>
        <div>
            <span>
                {color}
            </span>
            <input
                type="color"
                bind:value={color}
                on:input={(e) => {
                    ctx.strokeStyle = e.target.value;
                }}
            />
        </div>
        <div>
            <button
                on:click={() => {
                    download();
                }}>Export</button
            >
        </div>
    </div>
    <canvas id="canvas" bind:this={canvas} />
</div>

<style>
    #canvas {
        position: absolute;
        top: 40px;
        height: calc(100% - 40px);
        width: 100%;
    }
    .notpaint {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .notpaint .header {
        position: absolute;
        height: 40px;
    }
    .header {
        display: flex;
        width: 100%;
        border-bottom: 1px solid black;
    }
    .header div {
        padding: 5px;
    }
</style>
