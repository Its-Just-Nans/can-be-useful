<script lang="ts">
    import Converter from "./lib/Converter.svelte";
    import EditorChoice from "./lib/EditorChoice.svelte";
</script>

<main>
    <h1>
        <span>String explorer - </span>
        <a href="https://github.com/Its-Just-Nans/string-explorer">github.com/Its-Just-Nans/string-explorer</a>
    </h1>
    <EditorChoice />
    <Converter />
</main>

<style>
    h1 {
        margin: 0px;
    }
    :global(body) {
        margin: 0px;
    }
</style>
