<script>
    import { onMount } from "svelte";
    import { settings } from "../stores";
    import { applyDefaultPosition, makeDraggable } from "./utils";
    export let name = "";
    let allowMove = true;
    let elmnt = null;
    let header = null;
    onMount(() => {
        applyDefaultPosition(elmnt, name);
        if (!allowMove) {
            return;
        }
        settings.subscribe((writable) => {
            allowMove = writable.allowMove || false;
            if (allowMove === true) {
                setTimeout(() => {
                    makeDraggable(header, elmnt, name);
                }, 200);
            }
        });
    });
</script>

<div id="mydiv" bind:this={elmnt}>
    {#if allowMove}
        <div id="mydivheader" bind:this={header}>Click here to move</div>
    {/if}
    <slot />
</div>

<style>
    #mydiv {
        position: absolute;
        z-index: 9;
        background-color: #f1f1f1;
        border: 1px solid #d3d3d3;
        text-align: center;
    }

    #mydivheader {
        padding: 10px;
        cursor: move;
        z-index: 10;
        background-color: #2196f3;
        color: #fff;
    }
</style>
