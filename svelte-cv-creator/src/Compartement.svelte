<script>
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import Activity from "./Activity.svelte";
    export let datas = [];
    const flipDurationMs = 200;
    function handleDndConsiderCards(cid, e) {
        datas = e.detail.items;
    }
    function handleDndFinalizeCards(cid, e) {
        datas = e.detail.items;
    }
</script>

<div class="section" use:dndzone={{ items: datas, flipDurationMs }} on:consider={(e) => handleDndConsiderCards(datas.id, e)} on:finalize={(e) => handleDndFinalizeCards(datas.id, e)}>
    {#each datas as oneItem (oneItem.id)}
        <div animate:flip={{ duration: flipDurationMs }}>
            <Activity infos={oneItem} />
        </div>
    {/each}
</div>

<style>
    .section {
        padding: 0.3em;
        border: 1px solid black;
        overflow-x: scroll;
    }
</style>
