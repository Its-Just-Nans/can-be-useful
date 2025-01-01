<script>
    import { onMount } from "svelte";
    import Plotly from "plotly.js-dist";
    import { data, url } from "./store";
    let y = "";
    let currentData = [];
    data.subscribe((dat) => {
        currentData = dat;
    });
    const render = () => {
        const unpack = (key) => {
            return currentData.records.map(function (row) {
                return row.fields[key];
            });
        };
        debugger;
        var data = [
            { mode: "lines", line: { color: "#b55400" }, y: unpack(y) },
            { mode: "lines", line: { color: "#393e46" } },
            { mode: "lines", line: { color: "#222831" } },
        ];

        var layout = {
            title: "User Zoom Persists<br>When uirevision Unchanged",
            uirevision: "true",
            xaxis: { autorange: true },
            yaxis: { autorange: true },
        };

        Plotly.react("myDiv", data, layout);
    };
</script>

<p>
    {#if currentData && currentData.records && currentData.records[0] && currentData.records[0]?.fields}
        {#each Object.keys(currentData.records[0].fields) as oneField}
            <span>
                <input
                    type="checkbox"
                    on:click={(e) => {
                        y = e.target.nextElementSibling.innerHTML;
                        render();
                    }}
                /><span>{oneField}</span>
            </span>
            <br />
        {/each}
    {/if}
</p>
<div id="myDiv" />
