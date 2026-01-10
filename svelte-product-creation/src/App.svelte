<script lang="ts">
    import DesignThinking from "./lib/DesignThinking.svelte";
    import Product from "./lib/Product.svelte";
</script>

<main class="col">
    <div class="block">
        <p class="title">
            product creation
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
                class="cursor"
                on:click={() => {
                    localStorage.clear();
                    window.location.reload();
                }}>(reset)</span
            >
        </p>
    </div>

    <div>
        <Product />
    </div>
    <div>
        <DesignThinking />
    </div>
</main>

<style>
    .cursor {
        cursor: pointer;
    }
    p {
        text-transform: uppercase;
        font-weight: bolder;
        margin: 0px;
        font-size: 1.5em;
        text-align: center;
        padding: 10px;
        word-spacing: 30px;
        letter-spacing: 10px;
    }
    p span {
        font-size: 0.5em;
        text-transform: lowercase;
        letter-spacing: 0px;
        word-spacing: 0px;
    }
</style>
