<script>
    import { onMount } from "svelte";
    let matches = [];
    let lieux = [];
    onMount(async () => {
        await fetch("https://bel-art.rezel.net/cors/https://www.cs-sports.fr/apiTOSS/data/Lieux/Langue=fr").then(
            async (data) => {
                const res = await data.json();
                if (res && res.resultat && res.resultat.data) {
                    lieux = res.resultat.data;
                }
            }
        );
        fetch("https://bel-art.rezel.net/cors/https://www.cs-sports.fr/apiTOSS/data/Resultats/Ecole=56").then(
            async (data) => {
                const res = await data.json();
                if (res && res.resultat && res.resultat.data) {
                    matches = res.resultat.data.matchs;
                }
            }
        );
    });
    const getLieu = (id) => {
        if (lieux && lieux.length > 0) {
            const lieu = lieux.find((l) => l.id_lieu === id);
            if (lieu) {
                return lieu.campus + " " + lieu.lieu + " - " + lieu.descriptions; //+ " - " + JSON.stringify(lieu.region);
            }
        }
        return "";
    };
    const getLieuLink = (id) => {
        if (lieux && lieux.length > 0) {
            const lieu = lieux.find((l) => l.id_lieu === id);
            if (lieu && lieu.region.latitude && lieu.region.longitude) {
                return `https://www.google.com/maps/search/${lieu.region.latitude}+${lieu.region.longitude}`;
            }
        }
        return "";
    };
</script>

<main>
    {#if matches.length > 0}
        {#each matches as oneMatch}
            <div>
                {#each Object.keys(oneMatch) as categories}
                    <div class="cat">
                        <p>{categories}</p>
                        {#each oneMatch[categories] as oneMatch}
                            <div class="match">
                                <span>{oneMatch.date} - {oneMatch.heure}</span>
                                <br />
                                <span>{oneMatch.name1}</span> vs
                                <span>{oneMatch.name2}</span>
                                <br />
                                <span class="loc"
                                    >{getLieu(oneMatch.id_lieu) || "leur API n'a aucun sens, pas de lieu"}</span
                                >
                                <span class="loc"
                                    >(<a target="_blank" href={getLieuLink(oneMatch.id_lieu)}>lien maps</a>)</span
                                >
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        {/each}
    {:else}
        <div class="lag">
            <p>Contact avec l'API de CS en cours</p>
            <div class="loader" />
            <p>Pas ma faute si leur API en carton lag :)</p>
            <p>Sinon tu peux essayer de recharger la page</p>
        </div>
        <hr />
    {/if}
    <div>
        <p>oui j'ai reverse l'appli pour avoir l'url de leur API</p>
        <p>#EcoleDuNumerique</p>
        <p>repo <a target="_blank" href="https://github.com/bel-art/toss">https://github.com/bel-art/toss</a></p>
    </div>
</main>

<style>
    .loc {
        font-size: 0.7em;
    }
    .match {
        line-break: anywhere;
        margin-bottom: 20px;
    }
    .lag {
        text-align: center;
    }
    .loader {
        margin: auto;
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .cat {
        border: 1px solid black;
        margin-bottom: 10px;
    }
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }
</style>
