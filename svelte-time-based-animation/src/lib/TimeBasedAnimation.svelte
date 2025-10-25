<script lang="ts">
    import { onMount } from "svelte";
    import { createScene, setBaseTime } from "./scene";
    let el;
    onMount(() => {
        createScene(el);
    });
</script>

<div class="title">
    <h1>Time Based Animation</h1>
</div>
<canvas bind:this={el}></canvas>
<div class="controls">
    <input
        type="range"
        on:input={(event) => {
            setBaseTime(event.target.valueAsNumber);
        }}
        max="50"
        min="1"
        value="1"
    />
</div>

<style>
    :global(body) {
        overflow: hidden;
    }
    .title {
        position: absolute;
        top: 5%;
        width: 100%;
        display: flex;
        color: white;
        text-align: center;
        font-family: system-ui;
    }
    .title > * {
        margin: auto;
    }
    .controls {
        position: absolute;
        bottom: 10%;
        width: 100%;
        display: flex;
    }
    input {
        margin: auto;
    }
</style>
