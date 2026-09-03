<script>
    import * as PANOLENS from "panolens";
    import { onMount } from "svelte";
    import { onhashchange } from "./navigation";
    import { Menus } from "./constants";
    window.process = {
        env: {},
    };
    let component;
    let div;
    let viewer;
    window.location.hash = "";
    window.onhashchange = () => {
        component = onhashchange();
    };
    window.location.hash = Menus.CAMP;
    onMount(() => {
        viewer = new PANOLENS.Viewer({
            container: div,
        });
        const controlItemPoster = {
            style: {
                content: "about",
                backgroundColor: "white",
                float: "left",
            },
            onTap: function () {
                console.log("fDSF"); // TODO store
            },
        };
        viewer.appendControlItem(controlItemPoster);
        const controlItemPoster1 = {
            style: {
                content: "about",
                // backgroundColor: "white",
                backgroundImage:
                    "url(https://images.squarespace-cdn.com/content/v1/5c4f0a0a4eddecd28949d293/1563297755595-7NB6GRTMWCHKG2AFOIK7/rectangle.png)",
                float: "left",
            },
            onTap: function () {
                console.log("fDSF"); // TODO store
            },
        };
        viewer.appendControlItem(controlItemPoster1);
    });
</script>

<div class="myDiv" bind:this={div} />
<svelte:component this={component} {viewer} />

<style>
    .myDiv {
        position: absolute;
        height: 100vh;
        width: 100vw;
    }
</style>
