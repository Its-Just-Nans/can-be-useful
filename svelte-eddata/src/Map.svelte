<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import Plotly from "plotly.js-dist";
    import { copyContextToImage } from "./useful";
    let myDiv = null;
    onMount(() => {
        d3.json("./a.json").then(function (figure) {
            var trace1 = {
                x: figure.data[0].x,
                y: figure.data[0].y,
                z: figure.data[0].z,
                name: "",
                colorscale: figure.data[0].colorscale,
                type: "surface",
                showscale: false,
            };
            var trace2 = {
                x: figure.data[1].x,
                y: figure.data[1].y,
                z: figure.data[1].z,
                name: "",
                colorscale: figure.data[1].colorscale,
                type: "surface",
                showscale: false,
            };
            var trace3 = {
                x: figure.data[2].x,
                y: figure.data[2].y,
                z: figure.data[2].z,
                colorscale: figure.data[2].colorscale,
                type: "surface",
                showscale: false,
            };
            var trace4 = {
                x: figure.data[3].x,
                y: figure.data[3].y,
                z: figure.data[3].z,
                colorscale: figure.data[3].colorscale,
                type: "surface",
                showscale: false,
            };
            var trace5 = {
                x: figure.data[4].x,
                y: figure.data[4].y,
                z: figure.data[4].z,
                colorscale: figure.data[4].colorscale,
                type: "surface",
                showscale: false,
            };
            var trace6 = {
                x: figure.data[5].x,
                y: figure.data[5].y,
                z: figure.data[5].z,
                colorscale: figure.data[5].colorscale,
                type: "surface",
                showscale: false,
            };
            var trace7 = {
                x: figure.data[6].x,
                y: figure.data[6].y,
                z: figure.data[6].z,
                name: "",
                colorscale: figure.data[6].colorscale,
                type: "surface",
                showscale: false,
            };

            var data = [trace1, trace2, trace3, trace4, trace5, trace6, trace7];

            var layout = {
                title: "Ribbon Plot",
                showlegend: false,
                autosize: true,
                width: 600,
                height: 600,
                scene: {
                    xaxis: { title: "Sample #" },
                    yaxis: { title: "Wavelength" },
                    zaxis: { title: "OD" },
                },
            };
            Plotly.newPlot("myDiv", data, layout);
        });
    });
</script>

<div id="myDiv" bind:this={myDiv} />
<button
    on:click={() => {
        copyContextToImage(myDiv);
    }}>copy</button
>
