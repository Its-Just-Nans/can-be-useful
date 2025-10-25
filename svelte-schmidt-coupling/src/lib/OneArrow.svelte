<script>
    import { onKeyDown, coords, movement, radius } from "./store";
    export let name = "";
    let timer;
    const time = 50;
    const clear = () => {
        clearInterval(timer);
    };
    const keyDown = () => {
        onKeyDown(
            { key: name, radius: $radius, movement: $movement },
            { x2: $coords.x2, z2: $coords.z2, x3: $coords.x3, z3: $coords.z3 }
        );
    };
    const click = () => {
        timer = setInterval(() => {
            keyDown();
        }, time);
        keyDown();
    };
    const size = 48;
</script>

<span
    role="button"
    tabindex="0"
    on:mousedown={click}
    on:mouseleave={clear}
    on:mouseup={clear}
    on:touchstart={click}
    on:touchcancel={clear}
    on:touchend={clear}
>
    {#if name === "ArrowLeft"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather-arrow-left"
        >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
    {:else if name === "ArrowRight"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather-arrow-right"
        >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    {:else if name === "ArrowUp"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather-arrow-up"
        >
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
    {:else if name === "ArrowDown"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather-arrow-down"
        >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
    {/if}
</span>

<style>
    span {
        display: inline-block;
        border: 1px solid black;
        border-radius: 5px;
        background-color: snow;
    }
    span:hover {
        cursor: pointer;
    }
    span svg {
        display: block;
    }
</style>
