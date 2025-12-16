<script lang="ts">
    import { readURL, writeURL, defaultURL } from "./api";
    import { BarcodeDetector as BarcodeDetectorPolyfill } from "barcode-detector/pure";

    let currentUrl = "";
    let currentDate = "";
    readURL().then(({ url, date }) => {
        currentUrl = url;
        currentDate = date;
    });
    let newUrl = defaultURL;
    let showButton = true;
    let files;
    let errors = "";
    const readQRCode = async (data) => {
        return new Promise((resolve, reject) => {
            const barcodeDetector = new BarcodeDetectorPolyfill();
            barcodeDetector
                .detect(data)
                .then((barcodes) => {
                    resolve(barcodes);
                })
                .catch((e) => {
                    errors += e;
                    resolve([]);
                });
        });
    };
</script>

<main>
    <div>
        <span> CurrentURL: </span>
        <a href={currentUrl} target="_blank">{currentUrl || "loading..."}</a>
        <br />
        <span>lastUpdated :</span>
        <span>{currentDate || "loading..."}</span>
    </div>
    <hr />
    <div class="type">
        <p>Update URL with text</p>
        <input class="i-text" type="text" bind:value={newUrl} />
    </div>
    <br />
    <div class="type">
        <p>Update URL with QR code (image)</p>
        <input type="file" bind:files on:input={() => {}} />
    </div>
    <br />
    {#if showButton}
        <button
            on:click={async () => {
                try {
                    let toUpdate = "";
                    if (files && files[0]) {
                        errors += "Reading QR code...\n";
                        const urls = await readQRCode(files[0]);
                        errors += "Finished\n";
                        if (urls.length > 0) {
                            toUpdate = urls[0].rawValue;
                        } else {
                            errors += "No QR code found\n";
                        }
                    } else {
                        errors = "";
                        toUpdate = newUrl;
                    }
                    if (!toUpdate || toUpdate === "") {
                        errors += "Please enter a valid URL";
                        return;
                    }
                    if (!toUpdate.startsWith("http")) {
                        toUpdate += "https://";
                    }
                    if (!toUpdate.startsWith(defaultURL)) {
                        errors += `URL doesn't start with ${defaultURL}`;
                        return;
                    }
                    if (toUpdate.length < defaultURL.length + 1) {
                        errors += `URL is too short`;
                        return;
                    }
                    showButton = false;
                    const ans = await writeURL(toUpdate);
                    currentUrl = ans.url;
                    currentDate = ans.date;
                    newUrl = "";
                    showButton = true;
                } catch (e) {
                    errors += e;
                }
            }}>Update</button
        >
    {:else}
        <p>Updating...</p>
    {/if}
    <br />
    <span class="errors">{errors}</span>
    <hr />
    <div>
        <span>Code <a href="https://github.com/Its-Just-Nans/can-be-useful/tree/main/svelte-shared-qr-code">here</a></span>
    </div>
</main>

<style>
    .i-text {
        width: 100%;
    }
    .errors {
        color: red;
    }
    .type {
        background-color: gray;
        padding: 10px;
    }
    a {
        word-break: break-all;
    }
</style>
