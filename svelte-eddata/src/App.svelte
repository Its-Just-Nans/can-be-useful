<script>
    import Map from "./Map.svelte";
    import Normal from "./Normal.svelte";
    import OpenMap from "./OpenMap.svelte";
    import Test from "./Test.svelte";
    import { data, url } from "./store";
    let types = [
        {
            name: "Normal",
            component: Normal,
        },
        {
            name: "Test",
            component: Test,
        },
        {
            name: "3D",
            component: Map,
        },
        {
            name: "OpenMap",
            component: OpenMap,
        },
    ];
    let component = OpenMap;
    let urlValue =
        "https://data.economie.gouv.fr/api/records/1.0/search/?dataset=comptes-individuels-des-groupements-a-fiscalite-propre-fichier-global-a-compter-";
</script>

<main>
    <svelte:component this={component} url={urlValue} />
    <p>{urlValue}</p>
    <input
        class="input"
        type="text"
        on:input={(e) => {
            url.set(e.target.value);
        }}
    />
    <div>
        {#each types as oneType}
            <button
                on:click={() => {
                    component = oneType.component;
                }}
            >
                {oneType.name}
            </button>
        {/each}
    </div>
</main>

<style>
    .input {
        width: 100%;
    }
</style>
