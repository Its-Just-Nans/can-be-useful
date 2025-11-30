<script lang="ts">
    import MonacoEditor from "./MonacoEditor.svelte";
    import SimpleEditor from "./SimpleEditor.svelte";

    let isMonaco = true;
</script>

<button
    on:click={() => {
        isMonaco = !isMonaco;
    }}>Toggle</button
>
{#if isMonaco}
    <MonacoEditor />
{:else}
    <SimpleEditor />
{/if}
