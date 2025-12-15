<script lang="ts">
    import { onMount } from "svelte";
    import { mouseDown, moveAll, mouseUp, mousemoveImg, clickImg, getMapContainer } from "./func";
    export let key;
    export let data;

    const id = key.split("/").pop();

    let img: HTMLImageElement;

    let dataValue = 0;
    onMount(() => {
        if (data) {
            Object.entries(data.style).forEach(([styleProp, val]) => {
                if (styleProp === "zIndex") {
                    dataValue = val;
                }
                img.style[styleProp] = val;
            });
        }
        img.addEventListener(
            "contextmenu",
            (e) => {
                e.preventDefault();
                img.remove();
            },
            false
        );
        img.addEventListener(
            "dblclick",
            (e) => {
                e.currentTarget.style.zIndex = 10000;
                mouseDown(e);
                document.removeEventListener("mousemove", moveAll);
                document.removeEventListener("mouseup", mouseUp);
                getMapContainer().removeEventListener("mousedown", mouseDown);

                img.addEventListener("mousemove", mousemoveImg, false);
                img.addEventListener("click", clickImg, false);
            },
            false
        );
    });
</script>

<img
    bind:this={img}
    src={`./bulbapedia/${id}`}
    alt={key}
    class="map-image"
    {id}
    draggable="false"
    title={id}
    data-value={dataValue}
/>

<style>
    .map-image {
        position: absolute;
        user-select: none;
    }
    .map-image:hover {
        z-index: 10000 !important;
    }
</style>
