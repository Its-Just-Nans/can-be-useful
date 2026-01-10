<script lang="ts">
    import Login from "./lib/Login/Login.svelte";
    import Account from "./lib/Account/Account.svelte";
    import Admin from "./lib/Admin/Admin.svelte";
    import Home from "./lib/Home.svelte";
    import { Router, Link, Route, links } from "svelte-routing";
    import { onMount } from "svelte";
    import { myFetch } from "./lib/utils";
    import { user, APP_NAME, PREFIX_URL } from "./lib/stores";
    import { checkLogin } from "./lib/Login/login";
    import Redirect from "./lib/Redirect.svelte";
    let isOnline: null | boolean = null;
    onMount(() => {
        checkLogin();
        myFetch("")
            .then((data) => {
                if (data) {
                    isOnline = true;
                }
            })
            .catch(() => {
                isOnline = false;
            });
    });
</script>

<svelte:head>
    <title>{APP_NAME}</title>
</svelte:head>

<Router basepath={PREFIX_URL}>
    <div class="header">
        <a href={PREFIX_URL}>
            <h1>{APP_NAME}</h1>
        </a>
    </div>
    <div>
        <Route path={"/account"}>
            {#if $user}
                {#if $user.isAdmin}
                    <Admin />
                {:else}
                    <Account />
                {/if}
            {:else if $user === null}
                <Redirect />
            {/if}
        </Route>
        <Route path={"/login"}><Login /></Route>
        <Route path={"/"}><Home /></Route>
        <Route path="*">404</Route>
    </div>
</Router>

<style>
    .header {
        font-family: system-ui;
        display: flex;
        justify-content: center;
    }
    a {
        text-decoration: none;
        color: black;
    }
</style>
