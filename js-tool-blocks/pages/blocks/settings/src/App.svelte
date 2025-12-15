<script>
    import { onMount } from "svelte";

    import Blocks from "./Blocks.svelte";
    import Settings from "./Settings.svelte";
    const menus = [
        { name: "Settings", component: Settings },
        { name: "Blocks", component: Blocks },
    ];
    let color;
    try {
        color = window.parent.api.getColor() || "orange";
    } catch (e) {
        color = "brown";
    }
    let indexNav = 0;
</script>

<nav style="--globalColor: {color}">
    {#each menus as { name }, index}
        <div
            class={index === indexNav ? "selectedMenu" : ""}
            on:click={() => {
                indexNav = index;
            }}
            on:keypress={(event) => {
                if (event.key === "Enter") {
                    indexNav = index;
                }
            }}
            tabindex={index}
        >
            <h4>
                {name}
            </h4>
        </div>
    {/each}
</nav>
<div class="settings" style="--globalColor: {color}">
    <svelte:component this={menus[indexNav].component} />
</div>

<style>
    :global(*) {
        box-sizing: border-box;
        font-family: monospace;
        font-size: 1.02em;
    }

    .selectedMenu {
        transition: 0.25s;
        box-shadow: 0px 0px 0px 2px var(--globalColor);
    }

    nav {
        display: inline-block;
        padding: 10px;
        border-bottom: 1px solid var(--globalColor);
        width: inherit;
    }
    nav > div {
        margin: 0px;
        margin: 10px;
        border-radius: 10px;
        display: inline-block;
        cursor: pointer;
        border: 1px solid var(--globalColor);
    }
    nav > div:hover {
        transition: 0.25s;
        box-shadow: 0px 0px 0px 3px var(--globalColor);
    }
    nav > div:focus {
        outline: none;
        transition: 0.25s;
        box-shadow: 0px 0px 0px 3px var(--globalColor);
    }
    nav > div > * {
        margin: 0px;
        padding: 5px;
    }
    .settings {
        width: inherit;
        padding: 10px;
    }
</style>
