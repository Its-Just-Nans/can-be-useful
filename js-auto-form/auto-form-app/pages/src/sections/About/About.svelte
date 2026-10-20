<script>
    import { startDrag } from "../../api";
    let output = "lol";
</script>

<div>
    <div class="carre">
        <p>Marre des démarches administratives fastidieuses et complexes ?</p>
        <img src="./img/auto_form.svg" width="100px" alt="logo" />
        <br />
        <br />
        <br />
        <p class="title">Utilisez AutoForm!</p>
        <p class="title">Une solution rapide, efficace et sécurisée !</p>
        <button
            on:mousedown={() => {
                startDrag();
            }}>drag</button
        >
    </div>
</div>

<style>
    div {
        width: 100%;
        height: 100%;
        font-size: 20px;
        top: 0px;
        position: absolute;
        background-color: #047afe;
    }
    .carre {
        background-color: black;
        color: #047afe;
        margin-top: 25vh;
        height: auto;
        width: 50%;
        margin-left: 50%;
        border: 1px solid black;
        border-right: 0px;
        padding: 20px 10px;
        padding-right: 0px;
    }
    .carre img {
        float: right;
    }
    .title {
        font-weight: bold;
        font-family: "BlinkMacSystemFont", "Lucida Grande", "Segoe UI", Ubuntu, Cantarell, sans-serif;
        margin: 0px;
    }
</style>
