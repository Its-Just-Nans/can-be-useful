<script>
    let titleName = "lol";
    let srcIframe = "./blocks/test/index.html";
    const allMenus = window.api.getMenus();
    let color = window.api.getColor();
    let displayMenu = allMenus;
    function changeMenu(index) {
        const menu = allMenus[index];
        const preloadLink = allMenus[index].preload;
        srcIframe = allMenus[index].src;
        const ifrmElement = document.getElementById("iframe");
        console.log(`Navigated to ${menu.name}`);
        window.block = window.api.getBlock(preloadLink || "") || {};
    }
    window.addEventListener("DOMContentLoaded", () => {
        const indexStartMenu = allMenus.findIndex((element) => {
            return element.name == "test";
        });
        changeMenu(indexStartMenu);
    });
    function search(event) {
        const value = event.target.value;
        displayMenu = allMenus.filter((element) => {
            if (element.name.startsWith(value)) {
                return true;
            }
            return false;
        });
    }
</script>

<nav style="--globalColor: {color}">
    <div class="inputDiv">
        <input on:input={search} placeholder="find blocks" />
    </div>
    {#each displayMenu as { name }, index}
        <div
            class="oneMenu"
            on:click={() => {
                changeMenu(index);
            }}
            on:keypress={(event) => {
                if (event.key === "Enter") {
                    changeMenu(index);
                }
            }}
            tabindex={index}
        >
            <h4>
                {name}
            </h4>
        </div>
    {/each}
</nav>
<iframe
    id="iframe"
    style="--globalColor: {color}"
    title={titleName}
    src={srcIframe}
/>

<style>
    :global(*) {
        box-sizing: border-box;
        --NavBarWidth: 35vh;
        --NavBarWidthMin: 275px;
        font-family: monospace;
        font-size: 1.02em;
    }
    .inputDiv {
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid var(--globalColor);
    }
    .inputDiv input {
        cursor: pointer;
        border: 0px;
        padding: 10px;
        font-size: 1.2em;
        width: 100%;
    }
    .inputDiv input:focus {
        outline: 0px;
    }

    .oneMenu {
        box-sizing: border-box;
        font-size: 1.1em;
        margin: 10px;
        border-radius: 10px;
        cursor: pointer;
        border: 1px solid var(--globalColor);
        text-align: left;
    }
    .oneMenu:hover {
        transition: 0.25s;
        box-shadow: 0px 0px 0px 3px var(--globalColor);
    }
    .oneMenu:focus {
        outline: none;
        transition: 0.25s;
        box-shadow: 0px 0px 0px 3px var(--globalColor);
    }
    nav > div > h4 {
        padding: 10px;
        margin: 0px;
    }
    nav {
        padding: 0px;
        border-bottom: 1px solid var(--globalColor);
        width: inherit;
        overflow-y: auto;
    }
    nav::-webkit-scrollbar {
        width: 10px;
    }
    nav::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
    }

    nav::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }
    iframe {
        position: absolute;
        width: calc(100vw - var(--NavBarWidth));
        max-width: calc(100vw - var(--NavBarWidthMin));
        height: 100vh;
        right: 0px;
        border: 0px;
        border-left: 2px solid var(--globalColor);
    }
    nav {
        position: absolute;
        width: var(--NavBarWidth);
        min-width: var(--NavBarWidthMin);
        height: 100vh;
        top: 0px;
    }
</style>
