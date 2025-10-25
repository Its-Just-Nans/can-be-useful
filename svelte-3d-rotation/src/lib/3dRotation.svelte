<script>
    import { onMount } from "svelte";
    import { draw } from "./index";
    import { rpz, representation } from "./representation";
    import { rot, rotation } from "./rotation";
    import { setUpEvents, removeEvents } from "./utils";
    let canvas;
    let idRequest;

    onMount(() => {
        canvas = document.getElementById("canvas");
        setUpEvents(canvas);
        localDraw();
        return () => {
            removeEvents();
        };
    });
    const localDraw = () => {
        window.cancelAnimationFrame(idRequest);
        const size = Math.round(Math.min(window.innerWidth, 1200) / 2);
        canvas.width = size;
        canvas.height = size;
        canvas.getContext("2d").translate(canvas.width / 2, canvas.height / 2);
        const renderFn = draw(canvas);
        idRequest = window.requestAnimationFrame(renderFn);
    };
    addEventListener("resize", localDraw);
</script>

<div class="rotation-div">
    <div class="canvas-wrap">
        <canvas id="canvas" bind:this={canvas}></canvas>
    </div>
    <div class="selector">
        <label class="select" for="slct">
            <select
                id="slct"
                value={Object.keys(rotation)[4]}
                on:change={(event) => {
                    const value = event.target.value;
                    if (Object.keys(rotation).includes(value)) {
                        $rot = value;
                        $rpz = Object.keys(representation)[0];
                    } else {
                        $rot = "none";
                        $rpz = value;
                    }
                }}
            >
                {#each Object.keys(representation) as r}
                    <option value={r}>{r}</option>
                {/each}
                {#each Object.keys(rotation).filter((e) => e !== "none") as r}
                    <option value={r}>{r}</option>
                {/each}
            </select>
            <svg>
                <use xlink:href="#select-arrow-down"></use>
            </svg>
        </label>
        <svg class="sprites">
            <symbol id="select-arrow-down" viewbox="0 0 10 6">
                <polyline points="1 1 5 5 9 1"></polyline>
            </symbol>
        </svg>
    </div>
</div>

<style>
    .selector {
        width: 10%;
        min-width: 200px;
        margin: auto;
        font-family: "Roboto", sans-serif;
    }
    .select {
        position: relative;
        min-width: 200px;
    }
    .select svg {
        position: absolute;
        right: 12px;
        top: calc(50% - 3px);
        width: 10px;
        height: 6px;
        stroke-width: 2px;
        stroke: #9098a9;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        pointer-events: none;
    }
    .select select {
        appearance: none;
        padding: 7px 40px 7px 12px;
        width: 100%;
        border: 1px solid #e8eaed;
        border-radius: 5px;
        background: #fff;
        box-shadow: 0 1px 3px -2px #9098a9;
        cursor: pointer;
        font-family: inherit;
        font-size: 16px;
        transition: all 150ms ease;
    }
    .select select:required:invalid {
        color: #5a667f;
    }
    .select select option {
        color: #223254;
    }
    .select select:focus {
        outline: none;
        border-color: #07f;
        box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.2);
    }
    .select select:hover + svg {
        stroke: #07f;
    }
    .sprites {
        position: absolute;
        width: 0;
        height: 0;
        pointer-events: none;
        user-select: none;
    }

    .rotation-div {
        position: absolute;
        touch-action: none;
        width: 100%;
        height: 100%;
    }
    .canvas-wrap {
        display: flex;
        justify-content: center;
    }
</style>
