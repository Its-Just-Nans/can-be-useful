<script>
    import Title from "./Title.svelte";
    import Compartement from "./Compartement.svelte";
    export let datas = {};
</script>

<main>
    <div>
        <Title title={datas.title} description={datas.description} />
    </div>
    <div id="content">
        <div id="leftRow">
            <Compartement datas={datas.left} />
        </div>
        <div id="rightRow">
            <Compartement datas={datas.right} />
        </div>
    </div>
</main>

<style>
    main {
        margin: auto;
        margin-top: 50px;
        width: 40vw;
        height: 70vw;
        border: 1px solid black;
    }
    #leftRow {
        flex: 0.75;
        bottom: 0px;
        left: 0px;
        background-color: blue;
    }
    #rightRow {
        flex: 1.5;
        bottom: 0px;
        right: 0px;
    }
    #content {
        display: flex;
    }
</style>
