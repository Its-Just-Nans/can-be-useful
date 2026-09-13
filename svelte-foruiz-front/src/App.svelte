<script>
    import Start from "./Start.svelte";
    import Header from "./Header.svelte";
    import AuthPopUp from "./AuthPopUp.svelte";
    import { component, isAuthStore } from "./utils/store";
    export let url = "";
    let actualComponent = null;
    component.subscribe((newCurrent) => {
        actualComponent = newCurrent || Start;
    });
    let isAuth = null;
    isAuthStore.subscribe((newValueNeedAuth) => {
        isAuth = newValueNeedAuth;
    });
</script>

{#if url === "404"}
    Page 404 !
{:else}
    <main>
        <Header />
        <svelte:component this={actualComponent} />
        {#if isAuth === false}
            <AuthPopUp />
        {/if}
    </main>
{/if}

<style>
    :global(*) {
        --color-primary: #00bcd4;
        --color-primary-2: #0097a7;
    }
    main {
        text-align: center;
        margin: 0 auto;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
