<script lang="ts">
    import { fromLocalStorage, saveLocalStorage, results, selected, getDomain, authorization, proxy } from "./utils";
    export let cartId;
    export let names = fromLocalStorage("names", "");
    let requesting = false;
    const onClick = async () => {
        const requests: Promise<Response>[] = [];
        $results = {};
        if ($selected.length === 0) {
            return alert("Select extensions");
        }
        if (names === "") {
            return alert("Enter domains");
        }
        const domains = names.split("\n");
        if (domains.length === 0) {
            return alert("Enter domains");
        }
        requesting = true;
        console.log(domains, $selected);
        domains.forEach((name) => {
            if (name === "") {
                return;
            }
            $selected.forEach((extension) => {
                const domain = `${name}.${extension}`;
                return requests.push(getDomain(domain, cartId));
            });
        });
        await Promise.allSettled(requests);
        requesting = false;
    };
</script>

<h2>Domains</h2>
<div>
    <label for="authorization">Authorization Header</label>
    <br />
    <input id="authorization" type="text" bind:value={$authorization} placeholder="Bearer ey.." />
</div>
<div>
    <label for="proxy">Proxy</label>
    <br />
    <input id="proxy" type="text" bind:value={$proxy} placeholder="http://localhost:3000" />
</div>
<p class="cartId">
    {cartId}
</p>
<textarea
    placeholder="Enter domains"
    bind:value={names}
    on:input={(e) => {
        saveLocalStorage("names", e.currentTarget.value);
    }}
/>
<br />
{#if !requesting}
    <button on:click={onClick}> Go </button>
{:else}
    <span class="load">Loading...</span>
{/if}

<style>
    .load {
        display: block;
        text-align: center;
    }
    h2 {
        text-align: center;
    }
    .cartId {
        text-align: center;
    }
    textarea {
        width: 100%;
        height: 200px;
    }
    button {
        width: 100%;
    }
</style>
