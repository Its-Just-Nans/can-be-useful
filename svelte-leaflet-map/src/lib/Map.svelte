<script type="text/javascript">
    import { onMount } from "svelte";
    import "leaflet/dist/leaflet.css";
    import { initMap, initCityMarkers } from "./map";

    const initMarkers = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const addresses = JSON.parse(event.target.result);
            initCityMarkers(addresses.features || addresses);
        };
        reader.readAsText(file);
    };

    const handleDrop = (ev) => {
        console.log("File(s) dropped");
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            [...ev.dataTransfer.items].forEach((item, i) => {
                // If dropped items aren't files, reject them
                if (item.kind === "file") {
                    const file = item.getAsFile();
                    initMarkers(file);
                }
            });
        } else {
            // Use DataTransfer interface to access the file(s)
            [...ev.dataTransfer.files].forEach((file, i) => {
                initMarkers(file);
            });
        }
    };

    onMount(async () => {
        initMap();
        console.log("Drop a file with markers");
    });
</script>

<div
    on:drop={handleDrop}
    aria-label="dropzone"
    role="region"
    on:dragover={(ev) => {
        ev.preventDefault();
        console.log("dragover");
        return false;
    }}
    on:dragleave={(ev) => {
        ev.preventDefault();
        console.log("dragleave");
        return false;
    }}
>
    <div id="map"></div>
</div>

<style type="text/css">
    #map {
        height: 100vh;
        width: 100vw;
    }
</style>
