<script>
    import Content from "./lib/Content.svelte";
    import Map from "./lib/Map.svelte";
</script>

<main>
    <section>
        <Content />
    </section>
    <section>
        <Map />
    </section>
</main>

<style>
    main {
        display: flex;
    }
    main section {
        flex: 1;
        width: 50%;
        height: 100vh;
    }
    :global(body) {
        margin: 0px;
    }
</style>
