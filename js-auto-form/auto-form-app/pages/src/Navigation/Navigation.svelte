<script>
    export let changeNav = null;
    import { defaultMenus } from "./defaultMenus";
    import { translate, secondPartTrans } from "../../useful";
    import Pages from "../sections/index";
    const othersMenus = [];
    const menus = [...defaultMenus, ...othersMenus];
    let value = "";
</script>

<nav class="nav js-nav is-shown">
    <header class="nav-header">
        <h1 class="nav-title"><strong>Auto-Form</strong></h1>
        <img class="nav-header-icon" src="./img/auto_form.svg" alt="logo" />
    </header>
    {#if defaultMenus.length > 0}
        {#each defaultMenus as oneMenu, indexMenu}
            <div class="nav-item u-category-windows">
                <h5 class="nav-category">
                    <svg class="nav-icon">
                        <use xlink:href={oneMenu.icon} />
                    </svg>
                    Menus
                </h5>
                {#each oneMenu.links as oneLinks}
                    {#if oneLinks.links}
                        <div
                            class="menu"
                            on:click={() => {
                                oneLinks.visible = !oneLinks.visible;
                            }}
                        >
                            <h5 type="button" class="bigtitle nav-button">
                                {translate(oneLinks.title)}
                            </h5>
                            <span>{oneLinks.visible ? "-" : "+"}</span>
                        </div>
                        {#if oneLinks.visible}
                            {#each oneLinks.links as oneSubLink}
                                <p
                                    type="button"
                                    on:click={() => {
                                        changeNav(oneSubLink.component, secondPartTrans(oneSubLink.title));
                                    }}
                                    class="nav-button subMenus"
                                >
                                    {translate(oneSubLink.title)}
                                </p>
                            {/each}
                        {/if}
                    {:else}
                        <div
                            class="menu"
                            on:click={() => {
                                changeNav(oneLinks.component, secondPartTrans(oneLinks.title));
                            }}
                        >
                            <h5 type="button" class="bigtitle nav-button">
                                {translate(oneLinks.title)}
                            </h5>
                        </div>
                    {/if}
                {/each}
            </div>
        {/each}
    {/if}

    <footer class="nav-footer">
        <button
            type="button"
            class="nav-footer-button"
            on:click={() => {
                changeNav(Pages.About);
            }}>About</button
        >
        <p>Autoform</p>
        <br />
        <p>Made with love &lt;3</p>
    </footer>
</nav>

<style>
    .bigtitle {
        margin: 0px;
        text-transform: uppercase;
        font-size: 11px;
        font-weight: normal;
    }
    .nav-category {
        margin: 0.2em 0;
        padding-left: 1rem;
        text-transform: uppercase;
    }
    .menu {
        display: flex;
        width: 100%;
        padding: 0.3rem;
        line-height: 2;
    }
    p {
        margin: 0px;
    }
    .menu > span {
        flex: 0.1;
    }
    .nav-button {
        background-color: transparent;
        padding-left: calc(1rem + 16px + 0.5rem);
        text-align: left;
        font: inherit;
        font-size: 13px;
        color: inherit;
        border: none;
        cursor: default;
        outline: none;
        flex: 0.9;
    }
    .menu:hover {
        background-color: hsla(0, 0%, 0%, 0.1);
    }
    .subMenus:hover {
        background-color: hsla(0, 0%, 0%, 0.1);
    }
    .subMenus {
        padding: 0.3rem;
        padding-left: calc(2rem + 4rem);
    }
    .nav-footer {
        margin-top: 1rem;
        padding: 2rem;
        border-top: 1px solid var(--color-border);
        text-align: center;
    }
    .nav-title {
        text-align: center;
    }
    .nav {
        width: 340px;
        overflow-x: hidden;
        overflow-y: auto;
        color: var(--color-subtle);
        border-right: 1px solid var(--color-border);
        background-color: var(--color-bg);
        visibility: hidden;
        opacity: 0;
    }
    .nav-footer-button {
        display: block;
        width: 100%;
        padding: 0;
        margin-bottom: 0.75rem;
        line-height: 2;
        text-align: left;
        font: inherit;
        font-size: 13px;
        color: inherit;
        border: none;
        background-color: transparent;
        cursor: default;
        outline: none;
        text-align: center;
    }

    .nav-footer-button:focus {
        color: var(--color-strong);
    }
    .nav.is-shown {
        visibility: visible;
        opacity: 1;
    }

    .nav-header {
        position: relative;
        padding: 2rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--color-border);
    }

    .nav-title {
        text-transform: uppercase;
        font-weight: 300;
        line-height: 1;
        margin: 0;
    }

    .nav-title strong {
        font-weight: 600;
        color: var(--color-strong);
    }

    .nav-header-icon {
        position: absolute;
        width: 36px;
        height: 36px;
        top: 1.5rem;
        /* magic */
        right: 1.75rem;
        /* magic */
    }

    .nav-item {
        padding: 0.5em 0;
    }

    .nav-icon {
        width: 16px;
        height: 16px;
        vertical-align: top;
        margin-right: 0.25rem;
    }
    /* .nav-button.is-selected {
        background-color: var(--color-accent);
    }
    .nav-button.is-selected,
    .nav-button.is-selected em {
        color: #fff;
    }
    .nav-button.is-selected:focus {
        opacity: 0.8;
    } */
</style>
