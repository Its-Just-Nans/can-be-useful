<script>
    import OneContactLine from "./OneContactLine.svelte";
    export let contacts = [];
</script>

{#each contacts as oneVCard}
    <div>
        <OneContactLine contact={oneVCard} />
    </div>
{/each}
