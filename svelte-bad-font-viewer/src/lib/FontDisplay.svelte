<script lang="ts">
    import FontTester from "./FontTester.svelte";
    import font from "../fonts";

    let idx = 0;
    let text: string = "The quick brown fox jumps over the lazy dog";
    let proxy = "http://localhost:8080/";
    $: fonts = font.slice(idx, idx + 20).join("\n");
</script>

<h1>unpretentious font-viewer</h1>

<div>
    <label for="idx">Index (to increment)</label>
    <input type="number" bind:value={idx} />
</div>
<div>
    <label for="auto">Auto-increment</label>
    <input
        type="checkbox"
        on:input={(e) => {
            if (e.currentTarget.checked) {
                const interval = setInterval(() => {
                    idx += 1;
                    fonts = font.slice(idx, idx + 20).join("\n");
                }, 200);
                e.currentTarget.setAttribute("interval", interval);
            } else {
                clearInterval(e.currentTarget.getAttribute("interval"));
            }
        }}
    />
</div>
<div>
    <label for="proxy">Proxy</label>
    <input type="text" bind:value={proxy} />
</div>
<textarea bind:value={text}></textarea>
<br />
<details>
    <summary>Fonts</summary>
    <textarea bind:value={fonts}></textarea>
    <br />
</details>
{#key fonts}
    {#each fonts.split("\n") as oneLine, index}
        {#if oneLine.trim() !== ""}
            <FontTester {proxy} font={oneLine} {text} index={idx + index} />
        {/if}
    {/each}
{/key}

<style>
    h1 {
        margin: 0;
    }
    textarea {
        width: 75%;
        max-width: 600px;
        height: 100px;
    }
</style>
