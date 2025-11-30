<script>
    import { APP_TITLE } from "./constants";
    import { getFile, readFile, writeToFile } from "./functions";
    import { filename, size, content, parsed, fileHandle, sidebar } from "./stores";
    import Menu from "./Menu.svelte";
</script>

<div class="header">
    <div>
        <Menu fill="ligthgray" />
    </div>
    <div class="head_element">
        {APP_TITLE}
    </div>
    <div>
        {#if !$fileHandle}
            <button
                on:click={async () => {
                    await getFile();
                    await readFile();
                }}
            >
                start
            </button>
        {/if}
        {#if $filename}
            <div>
                <div class="filename">
                    {$filename}
                </div>
                <div>({Math.round(($size / 1000) * 10) / 10} kb)</div>
            </div>
        {/if}
        <div>
            <button
                on:click={async () => {
                    await getFile(true);
                    await readFile();
                }}
            >
                open another
            </button>
        </div>
    </div>
</div>

<style>
    .filename {
        padding: 2px;
        background-color: gray;
        border-radius: 5px;
    }
    .header {
        color: black;
        background-color: #f7fafc;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
    }
</style>
