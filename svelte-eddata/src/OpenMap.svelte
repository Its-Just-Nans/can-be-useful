<script>
    import { onMount } from "svelte";
    import { data, url } from "./store";
    import * as d3 from "d3";
    import Plotly from "plotly.js-dist";
    import { copyContextToImage } from "./useful";
    let currentUrl = "";
    let myDiv = null;
    const dod3 = () => {
        d3.json(currentUrl).then(function (csv_rows) {
            data.set(csv_rows);
            function unpack(rows, key) {
                return rows.map(function (row) {
                    return row[key];
                });
            }
            var dataPlotly = [
                {
                    type: "scattermapbox",
                    text: unpack(csv_rows, "Globvalue"),
                    lon: unpack(csv_rows, "Lon"),
                    lat: unpack(csv_rows, "Lat"),
                    marker: { color: "fuchsia", size: 4 },
                },
            ];

            var layout = {
                dragmode: "zoom",
                mapbox: {
                    style: "open-street-map",
                    center: { lat: 38, lon: -90 },
                    zoom: 3,
                },
                margin: { r: 0, t: 0, b: 0, l: 0 },
            };

            Plotly.newPlot("myDiv", dataPlotly, layout);
        });
    };
    url.subscribe((a) => {
        currentUrl = a;
        if (currentUrl !== "") {
            dod3();
        } else {
            console.log("bad url");
        }
    });
</script>

<div id="myDiv" bind:this={myDiv} />
<button
    on:click={() => {
        copyContextToImage(myDiv);
    }}
>
    copy
</button>
