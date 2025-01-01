<script>
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    export let category;
    const flipDurationMs = 100;
    function handleDndConsiderCards(cid, e) {
        category = e.detail.items;
    }
    function handleDndFinalizeCards(cid, e) {
        category = e.detail.items;
    }
    function handleClick(e) {
        alert("dragabble elements are still clickable :)");
    }
</script>

<div class="column-content" use:dndzone={{ items: category, flipDurationMs }} on:consider={(e) => handleDndConsiderCards(category, e)} on:finalize={(e) => handleDndFinalizeCards(category, e)}>
    {#each category as item (item.id)}
        <div class="card" animate:flip={{ duration: flipDurationMs }} on:click={handleClick}>
            {item.name}
        </div>
    {/each}
</div>

<style>
    .card {
        height: 15%;
        width: 100%;
        margin: 0.4em 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #dddddd;
        border: 1px solid #333333;
    }
</style>
