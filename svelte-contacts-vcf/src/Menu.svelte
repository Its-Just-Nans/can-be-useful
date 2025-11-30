<script>
    import { sidebar } from "./stores";

    export let fill = "none";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    aria-label="menu"
    class="menu-div"
    on:click={() => {
        $sidebar = !$sidebar;
    }}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        {fill}
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-menu"
    >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
</div>

<style>
    .menu-div {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 10px;
        height: 50px;
        width: 50px;
        transition: 0.5s;
    }
    svg {
        height: 24px;
        width: 24px;
    }
    .menu-div:hover {
        border-radius: 50%;
        background-color: rgba(60, 64, 67, 0.08);
        outline: none;
    }
</style>
