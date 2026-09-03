<script>
    import Writing from "./Writing/Writing.svelte";
    import Scene from "./Scene.svelte";
    import { fade, fly } from "svelte/transition";
    let component = null;
    component = Writing;
    let visible = false;
    let time = 1000;
    setTimeout(() => {
        visible = true;
        setTimeout(() => {
            visible = false;
            setTimeout(() => {
                component = Scene;
                visible = true;
            }, time);
        }, 3000);
    }, 1000);
</script>

{#if visible}
    <main in:fade out:fly={{ y: 800, duration: time - 200 }}>
        <div class="content">
            <svelte:component this={component} />
        </div>
    </main>
{/if}

<style>
    .content {
        position: absolute;
        height: 100vh;
        width: 100vw;
    }
    main {
        text-align: center;
        margin: 0 auto;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
