<script>
    import Header from "./Header.svelte";
    import Sidebar from "./Sidebar.svelte";
    import OneContact from "./OneContact.svelte";
    import { Router, Link, Route } from "svelte-routing";
    import Home from "./Home.svelte";
    import Label from "./Label.svelte";
    import { sidebar } from "./stores";
    let url = "";
</script>

<main>
    <Router {url}>
        <div class="header">
            <Header />
        </div>
        <section>
            <div class="sidebar" class:open={$sidebar}>
                <Sidebar />
            </div>
            <div class="content" class:open={!$sidebar}>
                <Route path={"/person/:id"} let:params>
                    <OneContact hash={params.id} />
                </Route>
                <Route path={"/label/:label"} let:params>
                    {#key params}
                        <Label label={params.label} />
                    {/key}
                </Route>
                <Route path="/"><Home /></Route>
            </div>
        </section>
    </Router>
</main>

<style>
    :global(body) {
        margin: 0;
        font-family: Arial, sans-serif;
        --sidebar-width: 284px;
        --header-height: 64px;
    }
    :global(*) {
        box-sizing: border-box;
        font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            "Open Sans",
            "Helvetica Neue",
            sans-serif;
    }
    :global(a) {
        text-decoration: none;
        color: black;
    }
    main {
        background-color: #f7fafc;
        position: absolute;
        width: 100%;
        height: 100%;
        --animation: 0.3s ease-in-out;
    }
    .header {
        position: fixed;
        width: 100%;
        overflow: hidden;
        height: var(--header-height);
        z-index: 100;
    }
    section {
        position: absolute;
        height: calc(100% - var(--header-height));
        transition: var(--animation);
        top: var(--header-height);
    }
    .sidebar {
        position: fixed;
        width: var(--sidebar-width);
        left: calc(-1 * var(--sidebar-width));
        overflow: hidden;
        transition: var(--animation);
    }

    .sidebar.open {
        position: fixed;
        left: 0px;
    }
    .content {
        position: fixed;
        height: calc(100% - var(--header-height));
        width: calc(100% - var(--sidebar-width));
        left: var(--sidebar-width);
        transition: var(--animation);
    }
    .content.open {
        position: fixed;
        left: 0px;
        width: calc(100%);
    }
</style>
