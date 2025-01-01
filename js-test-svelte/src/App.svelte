<script lang="ts">
    let Chatbox;
    async function loadChatbox() {
        let stringName = "./ChatBox.svelte";
        import(stringName).then((res) => (Chatbox = res.default));
    }
</script>

<button on:click={loadChatbox}>Load chatbox</button>
<svelte:component this={Chatbox} />
