<script lang="ts">
    import Editor from "./lib/Editor.svelte";
    import Start from "./lib/Start.svelte";

    let start = true;
</script>

{#if start}
    <Start bind:start />
{:else}
    <Editor />
{/if}
