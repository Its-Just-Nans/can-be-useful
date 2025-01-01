<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import Plotly from "plotly.js-dist";
    let url_base64;
    onMount(() => {
        var img_jpg = d3.select("#jpg-export");

        // Plotting the Graph

        var trace = {
            x: [3, 9, 8, 10, 4, 6, 5],
            y: [5, 7, 6, 7, 8, 9, 8],
            type: "scatter",
        };
        var trace1 = {
            x: [3, 4, 1, 6, 8, 9, 5],
            y: [4, 2, 5, 2, 1, 7, 3],
            type: "scatter",
        };
        var data = [trace, trace1];
        var layout = { title: "Simple JavaScript Graph" };
        Plotly.newPlot("myDiv", data, layout)

            // static image in jpg format

            .then(function (gd) {
                Plotly.toImage(gd, {
                    height: 800,
                    width: 800,
                }).then(function (url) {
                    img_jpg.attr("src", url);
                    url_base64 = url;
                });
            });
    });
    function convertBase64ToBlob(base64, type) {
        var bytes = window.atob(base64);
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], { type: type });
    }
</script>

<div id="myDiv" />
<img id="jpg-export" alt="render" />
<button
    on:click={() => {
        let blobInput = "";
        let type = "image/png";
        if (url_base64.startsWith("data:image/svg+xml,")) {
            return;
        } else {
            const base64Data = url_base64.split(",")[1];
            type = url_base64.split(",")[0].split(";")[0].split(":")[1];
            blobInput = convertBase64ToBlob(base64Data, "image/png");
        }
        const clipboardItemInput = new ClipboardItem({
            [type]: blobInput,
        });
        navigator.clipboard.write([clipboardItemInput]);
        console.log("success");
    }}>copy svg</button
>
