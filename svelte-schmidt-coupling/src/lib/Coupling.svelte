<script>
    import { Canvas } from "@threlte/core";
    import Scene from "./Scene.svelte";
    import { radius, diskHeight, speed, movement } from "./store";
    import Arrows from "./Arrows.svelte";
</script>

<div class="threlte">
    <Canvas rendererParameters={{ powerPreference: "default" }}>
        <Scene />
    </Canvas>
    <div class="pane">
        <div class="instr">
            <span>Use Arrow Keys!</span>
        </div>
        <label for="radius">Radius</label>
        <input id="radius" bind:value={$radius} type="range" min="0.5" max="5" step="0.1" />
        <br />
        <label for="height">Height</label>
        <input id="height" bind:value={$diskHeight} type="range" min="0.1" max="1" step="0.1" />
        <br />
        <label for="speed">Speed</label>
        <input id="speed" bind:value={$speed} type="range" min="0.01" max="0.5" step="0.01" />
        <br />
        <label for="movement">Movement</label>
        <input id="movement" bind:value={$movement} type="range" min="0.01" max="0.5" step="0.01" />
    </div>
    <Arrows />
</div>

<style>
    .pane {
        position: absolute;
        right: 0px;
        top: 0px;
        padding: 10px;
        background-color: snow;
        border-left: 1px solid black;
        border-bottom: 1px solid black;
        font-family: monospace;
    }
    .threlte {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .instr {
        text-align: center;
    }
</style>
