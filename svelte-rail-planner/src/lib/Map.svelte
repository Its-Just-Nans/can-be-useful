<script>
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";
    import { onMount } from "svelte";
    import { data, start, stop, path, greenIcon, goldIcon, normalIcon } from "../stores";

    let mapContainer;
    let map;
    map = L.map(L.DomUtil.create("div"), {
        center: [47, 2],
        zoom: 6,
    });

    L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png ", {
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(map);

    onMount(() => {
        mapContainer.appendChild(map.getContainer());
        map.getContainer().style.width = "100%";
        map.getContainer().style.height = "100%";
        map.invalidateSize();
    });

    let markerStart = null;
    let markerStop = null;
    let markerPath = null;

    const clearMarkerPath = () => {
        if (markerPath) {
            markerPath.forEach((element) => {
                element.remove();
            });
        }
    };

    const placeOnMap = (marker, gare, ico) => {
        if (marker) {
            marker.remove();
            clearMarkerPath();
        }
        const { lon, lat } = gare.position_geographique;
        marker = L.marker([lat, lon], {
            icon: ico,
        });
        marker.addTo(map);
        marker.bindPopup(gare.nom).openPopup();
        return marker;
    };

    start.subscribe((code) => {
        if (!code) return;
        code = code.split(";")[0];
        const gare = $data.garesIndex[code];
        markerStart = placeOnMap(markerStart, gare, greenIcon);
    });

    stop.subscribe((code) => {
        if (!code) return;
        code = code.split(";")[0];
        const gare = $data.garesIndex[code];
        markerStop = placeOnMap(markerStop, gare, goldIcon);
    });

    path.subscribe((path) => {
        if (!path) return;
        if (path.length === 0) return;
        clearMarkerPath();
        markerPath = [];
        const latlngs = path.map((code) => {
            code = code.split(";")[0];
            const gare = $data.garesIndex[code];
            if (![$start, $stop].includes(code)) {
                markerPath.push(
                    L.marker([gare.position_geographique.lat, gare.position_geographique.lon], {
                        ico: normalIcon
                    })
                        .bindPopup(gare.nom)
                        .addTo(map)
                );
            }
            return [gare.position_geographique.lat, gare.position_geographique.lon];
        });
        const polyline = L.polyline(latlngs, { color: "red" }).addTo(map);
        markerPath.push(polyline);
        markerStart.closePopup();
        markerStop.closePopup();
    });
</script>

<div class="map" bind:this={mapContainer}>
    <slot></slot>
</div>

<style>
    .map {
        height: 100%;
        width: 100%;
    }
</style>
