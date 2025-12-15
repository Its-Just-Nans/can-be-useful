<script lang="ts">
    import { onMount } from "svelte";
    import Extensions from "./components/Extensions.svelte";
    import Results from "./components/Results.svelte";
    import Domains from "./components/Domains.svelte";
    import { setCartId } from "./components/utils";
    let cartId = "";
    let ovhSubsidiary = "FR";
    onMount(() => {
        fetch("https://api.ovh.com/1.0/order/cart", {
            method: "POST",
            body: JSON.stringify({ ovhSubsidiary }),
        }).then(async (resp) => {
            const cartData = await resp.json();
            cartId = cartData["cartId"];
            setCartId(cartId);
        });
    });
</script>

<main>
    <p class="desc">
        Check domains availability thougth the <a href="https://api.ovh.com/console/" target="_blank">OVH API</a> ! Code
        <a href="https://github.com/Its-Just-Nans/domains" target="_blank">here</a>
    </p>
    <div class="flex">
        <div class="extensions">
            <Extensions />
        </div>
        <div>
            <Domains {cartId} />
        </div>
        <div class="res">
            <Results />
        </div>
    </div>
</main>

<style>
    .desc {
        text-align: center;
    }
    :global(body) {
        margin: 0px;
        font-family: system-ui;
    }
    :global(*) {
        box-sizing: border-box;
    }

    .flex {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 100%;
    }

    .flex > div {
        flex: 0.3;
    }
</style>
