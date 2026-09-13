<script>
    import SvgIcon from "./svgIcon.svelte";
    import Account from "./Account/Account.svelte";
    import Start from "./Start.svelte";
    import { getAuth } from "./utils/api";
    import { component } from "./utils/store";
    import { isAuthStore } from "./utils/store";
    import Logo from "./logo.svg";
    getAuth(true).then((res) => {
        if (res && res.infos && res.infos.needAuth) {
            isAuth = false;
        }
    });
    let isAuth = null;
    isAuthStore.subscribe((newVal) => {
        isAuth = newVal;
    });
</script>

<header>
    <h1
        on:click={() => {
            component.set(Start);
        }}
    >
        <img src={Logo} class="logo-app" alt="logo-foruiz" />
    </h1>
    <span
        on:click={() => {
            component.set(Account);
        }}
    >
        {#if isAuth === null}
            <SvgIcon size={32} color="orange" />
        {:else if isAuth === false}
            <SvgIcon size={32} color="#999fa0" />
        {/if}
    </span>
    <!-- <h2 on:click={() => {}}>Account</h2> -->
</header>

<style>
    .logo-app {
        height: 70px;
    }
    header {
        z-index: 5;
        border-bottom: 1px solid black;
        display: flex;
        width: 100%;
    }
    header > span {
        flex: 1;
        cursor: pointer;
    }

    h1 {
        text-align: left;
        cursor: pointer;
        color: #ff3e00;
        flex: 9;
        margin: 0 0;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 400;
        font-family: system-ui;
    }
</style>
