<script lang="ts">
    import MovableBox from "./MovableBox.svelte";

    let boxes = 0;
    let helper = true;
</script>

<div id="view">
    {#each Array.from({ length: boxes }) as oneBox}
        <MovableBox />
    {/each}
</div>

{#if helper}
    <style>
        .movable {
            border: 1px solid red;
        }
    </style>
{/if}

<MovableBox root>
    <div class="controlDiv">
        <button
            on:click={() => {
                boxes++;
            }}
        >
            Add a box
        </button>
        <button
            on:click={() => {
                const newView = document.getElementById("view").innerHTML || "";
                console.log(newView);
                window.localStorage.setItem("view", newView);
            }}>Publish the view</button
        >
        <button
            on:click={() => {
                helper = !helper;
            }}>Remove Helper</button
        >
        <a href="./view.html" target="_blank">Open the view</a>
    </div>
</MovableBox>

<style>
    .controlDiv {
        background-color: lightblue;
    }
</style>
