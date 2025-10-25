<script lang="ts">
    import { onMount } from "svelte";
    import { getUrls } from "./urls";
    let username = "Its-Just-Nans";
    const updateParam = () => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("username", username);
        window.history.replaceState("", "", newUrl);
    };
    onMount(() => {
        const newUsername = new URLSearchParams(window.location.search).get("username");
        if (newUsername) {
            username = newUsername;
        } else {
            updateParam();
        }
    });
    const slicer = 150;
</script>

<h1 class="input">
    Username: <input type="text" bind:value={username} on:input={updateParam} />
</h1>
<br />
{#key username}
    {#each getUrls(username) as oneUrl}
        <div>
            <br />
            <a href={oneUrl}>
                <span>{oneUrl.length > slicer ? oneUrl.slice(0, slicer) + "..." : oneUrl}</span>
                <br />
                <img src={oneUrl} alt="stats" />
            </a>
        </div>
    {/each}
{/key}

<style>
    @media screen and (max-width: 1024px) {
        img {
            width: 100%;
        }
    }
    span {
        overflow-wrap: break-word;
    }
    .input {
        text-align: center;
        font-family: monospace;
    }
</style>
