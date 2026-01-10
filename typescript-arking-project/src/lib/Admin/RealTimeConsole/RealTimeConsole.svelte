<script lang="ts">
    import { onMount } from "svelte";
    import { getCarsIn, getCarsOut, getMacs } from "../utils";
    import { loadSocket, closeSocket, msgs } from "./realTimeConsole";

    onMount(() => {
        loadSocket();

        getMacs();
        getCarsIn();
        getCarsOut();
        return () => {
            console.log("admin socket unmounted");
            closeSocket();
        };
    });
</script>

<div>
    <span>Real-time console</span><button
        on:click={() => {
            $msgs = [];
        }}>Clear console</button
    >
    <div id="logger-admin">
        {#each $msgs as oneMsg}
            <span class="msg">{JSON.stringify(oneMsg)}</span>
        {/each}
    </div>
</div>

<style>
    #logger-admin {
        height: 200px;
        overflow-y: scroll;
    }
    .msg {
        display: block;
    }
</style>
