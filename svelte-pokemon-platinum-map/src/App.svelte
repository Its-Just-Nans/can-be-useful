<script lang="ts">
    import { onMount } from "svelte";
    import data from "./data.json";
    import OneImage from "./OneImage.svelte";
    import { mouseUp, mouseDown, clickImg, moveAll, getMapContainer, mousemoveImg } from "./func";
    import Scroller from "./Scroller.svelte";
    const urls = import.meta.glob("../public/bulbapedia/*.png", { eager: true });

    let minZindex = 1000;
    let maxZindex = 1000;

    data.forEach((d) => {
        if (d.style.zIndex < minZindex) {
            minZindex = d.style.zIndex;
        }
        if (d.style.zIndex > maxZindex) {
            maxZindex = d.style.zIndex;
        }
    });

    onMount(() => {
        document.addEventListener("keypress", (e) => {
            if (e.key === "e") {
                mouseUp();
                document.querySelectorAll(".map-image").forEach((img) => {
                    img.removeEventListener("mousemove", mousemoveImg);
                    clickImg({ preventDefault() {}, currentTarget: img, fake: true });
                });
            } else if (e.key === "a") {
                document.querySelectorAll(".map-image").forEach((img) => {
                    if (!img.style.transform) {
                        img.style.transform = `translate(500px, 500px)`;
                    }
                });
            }
        });

        getMapContainer().addEventListener("mousedown", mouseDown, false);

        document.addEventListener("mousemove", moveAll, false);

        document.addEventListener("mouseup", mouseUp, false);
    });
    const urlsFiltered = Object.entries(urls).filter(([key, value]) => {
        const id = key.split("/").pop();
        if (data.find((d) => d.image === id)) {
            return false;
        }
        return true;
    });
    console.log("todo", urlsFiltered.length);
</script>

<div id="map-container">
    <div id="map">
        {#each urlsFiltered as [key, value]}
            <OneImage {key} data={data[key.split("/").pop()]} />
        {/each}
        {#each data as oneData}
            <OneImage key={`../${oneData.image}`} data={oneData} />
        {/each}
    </div>
</div>
<Scroller min={minZindex} max={maxZindex} />

<style>
    #map-container {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        cursor: grab;
    }
    #map {
        position: absolute;
        top: 0;
        left: 0;
        width: 2000px; /* Map width */
        height: 2000px; /* Map height */
    }
</style>
