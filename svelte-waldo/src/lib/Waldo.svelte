<script lang="ts">
    import { onMount } from "svelte";
    import { waldoData } from "./waldoData";
    import { waldoImgs } from "./waldoData";
    let img = "";
    const size = 64;
    function update(e) {
        var x = e.clientX || e?.touches?.[0].clientX || 0;
        var y = e.clientY || e?.touches?.[0].clientY || 0;
        const img = document.getElementById("waldo");
        const dim = img.getBoundingClientRect();
        for (const oneWin of win) {
            const pos_x = (oneWin.x_px * dim.width) / 1024;
            const pos_y = (oneWin.y_px * dim.height) / 1024;
            if (
                x >= pos_x + correctSizeX * 0.2 &&
                x <= pos_x + correctSizeX * 0.8 &&
                y >= pos_y + correctSizeY * 0.2 &&
                y <= pos_y + correctSizeY * 0.8
            ) {
                isGameOn = false;
                document.removeEventListener("mousemove", update);
                document.removeEventListener("touchmove", update);
            }
        }
        document.documentElement.style.setProperty("--cursorX", x + "px");
        document.documentElement.style.setProperty("--cursorY", y + "px");
    }
    let win = [];
    const startGame = () => {
        isGameOn = true;
        const index = waldoImgs.indexOf(img) + 1;
        console.log("index", index);
        win = waldoData[size][index];
        document.addEventListener("mousemove", update);
        document.addEventListener("touchmove", update);
    };
    let imgElement;
    const getStyle = (x: number, y: number) => {
        if (imgElement) {
            const dim = imgElement.getBoundingClientRect();
            const pos_x = (x * dim.width) / 1024;
            const pos_y = (y * dim.height) / 1024;
            correctSizeX = (size * dim.width) / 1024;
            correctSizeY = (size * dim.height) / 1024;
            return `left: ${pos_x}px; top: ${pos_y}px; width: ${correctSizeX}px; height: ${correctSizeY}px;`;
        }
        return "";
    };
    let correctSizeX = size;
    let correctSizeY = size;
    let isGameOn = false;
    onMount(() => {
        window.addEventListener("resize", () => {
            imgElement = imgElement;
        });
    });
</script>

{#if img === ""}
    <!-- {JSON.stringify(waldoData)} -->
    <div class="flexed">
        {#each waldoImgs as item}
            <button
                on:click={() => {
                    img = item;
                    startGame();
                }}
            >
                {item}
            </button>
        {/each}
    </div>
{/if}

{#if img !== ""}
    <div class="img-wrap">
        {#if isGameOn == false}
            {#key imgElement}
                {#each win as oneWin}
                    <div class="success" style={getStyle(oneWin.x_px, oneWin.y_px)} />
                {/each}
            {/key}
        {/if}
        <img
            bind:this={imgElement}
            src={img}
            alt=""
            id="waldo"
            on:load={() => {
                imgElement = imgElement;
            }}
        />
        {#if isGameOn}
            <style>
                :root {
                    cursor: none;
                    --cursorX: 50vw;
                    --cursorY: 50vh;
                }
                :root:before {
                    content: "";
                    display: block;
                    width: 100%;
                    height: 100%;
                    position: fixed;
                    pointer-events: none;
                    background: radial-gradient(
                        circle 5vmax at var(--cursorX) var(--cursorY),
                        rgba(0, 0, 0, 0) 0%,
                        rgba(0, 0, 0, 0.5) 80%,
                        rgba(0, 0, 0, 0.95) 100%
                    );
                }
                body {
                    overflow-x: hidden;
                }
            </style>
        {/if}
    </div>
{/if}

<style>
    .flexed {
        display: flex;
        width: 100%;
        height: 100%;
        text-align: center;
        align-items: center;
    }
    .flexed > * {
        margin: auto;
    }
    .success {
        z-index: 100;
        position: absolute;
        border: 5px solid blue;
    }
    img {
        height: 100%;
        margin: auto;
    }
</style>
