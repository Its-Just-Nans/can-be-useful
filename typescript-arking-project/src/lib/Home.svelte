<script lang="ts">
    import Login from "./Login/Login.svelte";
    import Account from "./Account/Account.svelte";
    import Admin from "./Admin/Admin.svelte";
    import { user, getApiUrl, setApiUrl, PREFIX_URL } from "./stores";
    import { onMount } from "svelte";
    import { myFetch } from "./utils";
    import { navigate } from "svelte-routing";
    import { Router, Link, Route } from "svelte-routing";
    import { APP_NAME } from "./stores";
    import Logo from "../assets/arking.jpeg";

    let isOnline: null | boolean = null;
    const checkOnline = () => {
        myFetch("")
            .then((data) => {
                if (data) {
                    isOnline = true;
                }
            })
            .catch(() => {
                isOnline = false;
            });
    };
    onMount(() => {
        checkOnline();
    });
</script>

<div>
    <div class="div">
        <img src={Logo} alt="logo" class="img" />
        <p>
            {APP_NAME} is THE solution to manage your parking lots and provide a better experience to your customers.
        </p>
    </div>
    <div class="login-btn">
        <Link to={PREFIX_URL + "login"}>Login</Link>
    </div>
</div>
<div class="footer">
    <div>
        <br />
        <div class="status">
            <p>
                <details>
                    <summary>
                        <span> API status: </span>
                        {#if isOnline === true}
                            <span class="online"> Online </span>
                        {:else if isOnline === false}
                            <span class="offline"> Offline </span>
                        {:else}
                            <span> Loading... </span>
                        {/if}
                    </summary>
                    <input
                        type="text"
                        on:input={(event) => {
                            setApiUrl(event.target.value);
                            checkOnline();
                        }}
                        value={getApiUrl()}
                    />
                </details>
            </p>
        </div>
        <span>A project made for RIO203 - </span>
        <a href="about">Learn more</a>
    </div>
</div>

<style>
    .status {
        text-align: center;
    }
    .online {
        color: green;
        font-weight: bold;
    }
    .offline {
        color: red;
        font-weight: bold;
    }
    .footer {
        display: flex;
        justify-content: center;
    }
    .div {
        text-align: center;
    }
    .div > .img {
        height: 500px;
        border-radius: 50px;
    }
    .login-btn {
        text-align: center;
        border-radius: 5px;
        padding: 10px;
        width: 50px;
        margin: auto;
        background-color: #0cb0ef;
        box-shadow:
            rgba(0, 0, 0, 0.2) 0px 3px 3px -2px,
            rgba(0, 0, 0, 0.14) 0px 3px 4px 0px,
            rgba(0, 0, 0, 0.12) 0px 1px 8px 0px;
    }
    .login-btn:hover {
        background-color: #0ca0df;
        box-shadow: none;
    }
    .login-btn > :global(a) {
        text-decoration: none;
        color: black;
    }
</style>
