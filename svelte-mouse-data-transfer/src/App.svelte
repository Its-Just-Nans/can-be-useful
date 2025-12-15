<script lang="ts">
    import Sender from "./Sender.svelte";
    import Receiver from "./Receiver.svelte";
    let isSender: boolean | null = null;
</script>

{#if isSender === null}
    <button
        on:click={() => {
            isSender = true;
        }}
    >
        Sender (phone)
    </button>
    <button
        on:click={() => {
            isSender = false;
        }}
    >
        Receiver (computer)
    </button>
{:else if isSender}
    <Sender />
{:else}
    <Receiver />
{/if}

<style>
</style>
