<script>
    import { menus, showMenu } from "./menus.ts";
</script>

<div class="menu">
    {#each menus as oneMenu}
        <ul class="menu-list">
            {#each oneMenu as oneEntry}
                <li class="menu-item">
                    <a
                        href={oneEntry.link}
                        on:click={() => {
                            $showMenu = false;
                        }}
                        target="_blank"
                    >
                        <button class="menu-button">
                            <div class="front-list">
                                {#if typeof oneEntry.ico === "string"}
                                    <span>{oneEntry.ico}</span>
                                {:else}
                                    <svelte:component this={oneEntry.ico} size={20} />
                                {/if}
                            </div>
                            <span>{oneEntry.title || ""}</span>
                            <span>{oneEntry.subtitle || ""}</span>
                        </button>
                    </a>
                </li>
            {/each}
        </ul>
    {/each}
</div>

<style>
    .menu-button {
        cursor: pointer;
    }
    .menu-item:hover {
        background-color: lightgray;
    }
    span {
        color: var(--color-text-primary);
    }
    .menu {
        font-family: "Inter", sans-serif;
        display: flex;
        position: absolute;
        flex-direction: column;
        background-color: var(--color-bg-secondary);
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(64, 64, 64, 0.15);
        top: 10;
        left: 10;
        width: 250px;
    }

    .menu-list {
        margin: 0;
        display: block;
        width: 100%;
        padding: 0px;
    }
    .menu-list,
    ul {
        list-style-type: none;
    }
    .menu-list + .menu-list {
        border-top: 1px solid #ddd;
    }

    .menu-item {
        position: relative;
    }
    .menu-button {
        font: inherit;
        color: inherit;
        outline: none;
        border: 0;
        padding: 8px 8px;
        width: 100%;

        border-radius: 8px;
        display: flex;
        align-items: center;
        position: relative;
        background-color: var(--color-bg-secondary);
    }
    .menu-button:hover {
        background-color: var(--color-bg-primary-offset);
    }

    .menu-button .front-list {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        stroke: var(--color-text-primary-offset);
    }
    .menu-button span:nth-of-type(2) {
        margin-right: 0;
        position: absolute;
        right: 8px;
        font-size: x-small;
    }
</style>
