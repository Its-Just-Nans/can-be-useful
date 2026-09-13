<script>
    import { getAuth } from "./utils/api";
    let url = "";
    getAuth().then((auth) => {
        if (auth && auth.infos && auth.infos.needAuth && auth.infos.redirect) {
            url = auth.infos.redirect;
        } else {
        }
    });
</script>

<div class="back">
    <div class="middle">
        <div class="pop-up-auth">
            You are not connected
            <div
                on:click={() => {
                    window.location.href = url;
                }}
            >
                Authenticate
            </div>
        </div>
    </div>
</div>

<style>
    .middle {
        display: table-cell;
        vertical-align: middle;
    }
    .back {
        position: absolute;
        width: 100vw;
        height: 100vh;
        top: 0px;
        right: 0px;
        z-index: 10;
        display: table;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .pop-up-auth {
        margin: auto;
        width: 400px;
        z-index: 20;
        padding: 20px;
        border: 1px solid black;
        border-radius: 10px;
        border-radius: 10px;
        background-color: white;
        box-shadow: 8px 8px 5px lightgray;
    }
    .pop-up-auth > div {
        margin-top: 20px;
        cursor: pointer;
        padding: 10px;
        border: 1px solid black;
        box-shadow: 3px 3px 2px lightgray;
    }
</style>
