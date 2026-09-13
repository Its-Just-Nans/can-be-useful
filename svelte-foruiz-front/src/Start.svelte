<script>
    import { component } from "./utils/store";
    import ListQuizzes from "./Play/ListQuizzes.svelte";
    import Create from "./Creation/Create.svelte";
    const menus = [
        {
            name: "Play",
            component: ListQuizzes,
        },
        {
            name: "Create",
            component: Create,
        },
    ];
</script>

<div class="menu">
    {#each menus as oneMenu}
        <div
            class="button"
            on:click={() => {
                component.set(oneMenu.component);
            }}
        >
            {oneMenu.name}
        </div>
    {/each}
</div>

<style>
    .button {
        margin: 0 50px;
        border-radius: 10px;
        cursor: pointer;
        padding: 10px;
        background-color: lightgray;
        margin-bottom: 50px;
    }
    .menu {
        padding: 10px;
    }
    .menu > * {
        display: block;
    }
    @media (min-width: 640px) {
        .menu > * {
            display: inline-block;
        }
    }
</style>
