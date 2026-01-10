<script lang="ts">
    import { myFetch, setToken, handleErrors } from "../utils";
    import { PREFIX_URL, user } from "../stores";
    import { onMount } from "svelte";
    import { checkLogin, login, register } from "./login";
    import { USER_NOT_FOUND, USER_EXISTS } from "../../../shared/errors";
    import { navigate } from "svelte-routing";
    let username = "";
    let password = "";
    let plaque = "";
    let isLogin = true;
    let msg = "";
    $: typeof isLogin === "boolean" && (msg = "");
    user.subscribe((value) => {
        if (value) {
            navigate(PREFIX_URL + "account", { replace: true });
        }
    });
</script>

<div class="login">
    <div class="login-container">
        <form>
            <input type="text" bind:value={username} placeholder="Email" autocomplete="email" />
            <br />
            <input type="password" bind:value={password} placeholder="Password" autocomplete="current-password" />

            <br />
            {#if !isLogin}
                <input type="text" bind:value={plaque} placeholder="Plaque d'immatriculation" />
                <br />
            {/if}
        </form>
        {#if isLogin}
            <button
                on:click={() => {
                    login(username, password).then((data) => {
                        msg = handleErrors(data);
                    });
                }}
            >
                Login
            </button>
        {:else}
            <button
                on:click={() => {
                    register(username, password, plaque).then((data) => {
                        msg = handleErrors(data, () => {
                            isLogin = true;
                        });
                    });
                }}>Register</button
            >
        {/if}
        {#if isLogin}
            <div>
                <span> Don't have an account ? </span>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span
                    class="blue"
                    on:click={() => {
                        isLogin = false;
                    }}>Register</span
                >
            </div>
        {:else}
            <div>
                <span> Already have an account ? </span>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span
                    class="blue"
                    on:click={() => {
                        isLogin = true;
                    }}>Login</span
                >
            </div>
        {/if}
        <p class="error">{msg}</p>
    </div>
</div>

<style>
    .login {
        display: flex;
        margin: 0 auto;
        justify-content: center;
    }
    .error {
        color: red;
    }
    .blue {
        color: blue;
        cursor: pointer;
    }
    .login-container {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        width: 300px;
        text-align: center;
    }

    .login-container input {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        box-sizing: border-box;
    }

    .login-container button {
        background-color: #4caf50;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
