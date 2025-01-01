<script>
    import Cv from "./CV.svelte";
    import Sidebar from "./Sidebar.svelte";
    let CVdatas = {
        title: "Nans WEBERT",
        description: "étudiant",
        school: [
            {
                title: "lol",
                description: "oksqfosd",
            },
            {
                title: "IUT R&T",
                description: "oksqfosd",
            },
            {
                title: "ecole",
                description: "oksqfosd",
            },
        ],
    };
    let a = 0;
    let board = [
        { id: a, name: `item${a++}` },
        { id: a, name: `item${a++}` },
        { id: a, name: `item${a++}` },
        { id: a, name: `item${a++}` },
        { id: a, name: `item${a++}` },
        { id: a, name: `item${a++}` },
    ];
    let board2 = [
        { id: a, name: `item${a++}` },
        { id: a, name: `item${a++}` },
    ];
    let board3 = [
        { id: a, name: `item${a++}` },
        { id: a, name: `item${a++}` },
        { id: a, name: `item${a++}` },
        { id: a, name: `item${a++}` },
    ];
</script>

<main>
    <div id="selector"><Sidebar category={board} /></div>
    <div id="content">
        <Cv datas={{ right: board2, left: board3 }} />
    </div>
</main>

<style>
    :global(*) {
        box-sizing: border-box;
    }
    #selector {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 20vw;
        height: 100vh;
        border: 1px solid black;
    }
    #content {
        right: 0px;
        top: 0px;
        position: fixed;
        width: 80vw;
        height: 100vh;
        overflow-y: scroll;
    }
</style>
