<script>
    import { onMount } from "svelte";

    let value = 1000;
    export let min = 995;
    export let max = 1005;

    function updateValue(delta) {
        value = Math.min(max, Math.max(min, value + delta));
        filterElements();
    }

    function filterElements() {
        const elements = document.querySelectorAll(".map-image");
        elements.forEach((element) => {
            const dataValue = parseInt(element.getAttribute("data-value"), 10);
            if (dataValue > value && dataValue <= max) {
                element.classList.add("hidden");
            } else {
                element.classList.remove("hidden");
            }
        });
    }

    function onWheel(event) {
        event.preventDefault();
        const scrollAmount = event.deltaY > 0 ? 0.1 : -0.1; // Smaller increments
        updateValue(scrollAmount);
    }

    onMount(() => {
        filterElements();
        document.addEventListener("wheel", onWheel, { passive: false });
    });
</script>

<div class="slider-container">
    <button class="button" on:click={() => updateValue(1)}>+</button>
    <input class="slider" type="range" {min} {max} step="1" bind:value orient="vertical" />
    <button class="button" on:click={() => updateValue(-1)}>−</button>
</div>

<style>
    .slider-container {
        position: fixed;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        z-index: 10000;
    }

    .button {
        background-color: orange;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 18px;
    }

    .button:active {
        background-color: orangered;
    }

    .slider {
        writing-mode: bt-lr; /* Vertical slider */
        -webkit-appearance: slider-vertical;
        appearance: slider-vertical;
        accent-color: orange;
        height: 200px;
        width: 20px;
        margin: 10px 0;
    }

    :global(.hidden) {
        display: none;
    }
</style>
