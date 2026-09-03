<script>
    import { onMount } from "svelte";
    import * as PANOLENS from "panolens";
    import { init } from "./camp";
    export let viewer;
    const panorama = new PANOLENS.ImagePanorama("./imgs/img.jpg");
    onMount(() => {
        init(viewer, panorama);
    });
</script>
