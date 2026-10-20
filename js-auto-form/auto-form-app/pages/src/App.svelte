<script>
    import { fade } from "svelte/transition";
    import sections from "./sections/index";
    import Navigation from "./Navigation/Navigation.svelte";
    import allDatas from "./data/index";
    import { login, setPassword } from "./api";
    let actualPage = null;
    let dataPage = null;
    let data_title = "";
    const changeNav = (newComponent, dataCode = "") => {
        visible = false;
        if (newComponent) {
            actualPage = newComponent;
        }
        if (dataCode && allDatas[dataCode]) {
            data_title = dataCode;
            dataPage = allDatas[dataCode];
        } else {
            dataPage = [];
        }
        timer();
    };
    let password = "";
    let needSetPassword = true;
    let visible = false;
    let startMsg = "";
    const timer = () => {
        setTimeout(() => {
            visible = true;
        }, 200);
    };
    changeNav(sections.About);
    const tryLogin = async () => {
        startMsg = "";
        try {
            await login();
            needSetPassword = false;
        } catch (e) {
            if (e === "NO_PASS") {
                startMsg = "No password given";
                needSetPassword = true;
            } else if (e === "ERROR") {
                startMsg = "Error login";
            } else if (e === "BAD_PASSWORD") {
                startMsg = "Incorrect password";
                needSetPassword = true;
            }
        }
    };
    tryLogin();
</script>

{#if needSetPassword}
    <div class="start">
        <img src="./img/auto_form.svg" alt="" />
        <p>Password</p>
        <input bind:value={password} />
        <p class="start-msg">{startMsg}</p>
        <button
            on:click={(e) => {
                setPassword(password);
                tryLogin();
            }}
        >
            Connect
        </button>
    </div>
{:else}
    <Navigation {changeNav} />
    {#if visible}
        <main in:fade class="content">
            <svelte:component
                this={actualPage}
                data={dataPage}
                name={data_title}
            />
        </main>
    {/if}
{/if}

<style>
    .start-msg {
        color: red;
    }
    .start {
        text-align: center;
        margin: auto;
    }
    input,
    button {
        font-family: inherit;
        font-size: inherit;
        -webkit-padding: 0.4em 0;
        padding: 0.4em;
        margin: 0 0 0.5em 0;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 2px;
    }
    .content {
        flex: 1;
        position: relative;
        overflow: auto;
    }
</style>
