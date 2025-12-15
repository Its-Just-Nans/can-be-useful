<script>
    import { data, start, stop, path } from "../stores";
    import { dijkstra, get_path } from "../functions";

    let loading = false;
</script>

<div class="content">
    <h1>rail-planner</h1>
    <a href="https://github.com/Its-Just-Nans/rail-planner" target="_blank"
        >https://github.com/Its-Just-Nans/rail-planner</a
    >
    <p>
        This project use the open data of SNCF. As the data is incomplete, the project is not fully functional. Also the
        project calculates the shortest path between two stations (based on the location and not the duration). The
        project is based on the Dijkstra algorithm.
    </p>

    <hr />

    {#if $data.gares}
        <p>Number of Gares de voyageurs : {$data.gares.length}</p>
    {/if}

    {#if $data.intercites}
        <p>Number of Intercités : {$data.intercites.length}</p>
    {/if}

    {#if $data.ter}
        <p>Number of TER : {$data.ter?.length > 0 ? $data.ter.length : "No data :("}</p>
    {/if}

    <h2>Départ</h2>
    <select bind:value={$start}>
        {#each $data.gares as gare}
            <option value={gare.codes_uic}>{gare.nom}</option>
        {/each}
    </select>

    <h2>Arrivée</h2>
    <select bind:value={$stop}>
        {#each $data.gares as gare}
            <option value={gare.codes_uic}>{gare.nom}</option>
        {/each}
    </select>

    <button
        on:click={() => {
            loading = true;
            setTimeout(() => {
                try {
                    $path = [];
                    const [dist, calculatedPath] = dijkstra($data, $start, $stop);
                    $path = get_path(calculatedPath, $start, $stop);
                } catch (e) {
                    console.error(e);
                    $path = [$start];
                }
                loading = false;
            }, 100);
        }}>Rechercher</button
    >

    {#if loading}
        <p>Calcul en cours...</p>
        <div class="lds-dual-ring"></div>
    {:else if $path.length > 1}
        <p>Distance : {$path.length} stations</p>
        <div>
            {#each $path as code}
                <span>
                    {#if $data.garesIndex[code]}
                        {$data.garesIndex[code].nom}
                    {/if}
                    ({code})
                </span>
                <br />
            {/each}
        </div>
    {:else if $path.length === 1}
        <p>Pas de chemin trouvé</p>
    {/if}
</div>

<style>
    .content {
        padding: 1rem;
    }
    .lds-dual-ring {
        display: inline-block;
        width: 20px;
        height: 20px;
    }
    .lds-dual-ring:after {
        content: " ";
        display: block;
        width: 20px;
        height: 20px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid #3f51b5;
        border-color: #3f51b5 transparent #3f51b5 transparent;
        animation: lds-dual-ring 1.2s linear infinite;
    }
    @keyframes lds-dual-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
