<script>
    import { onMount } from "svelte";
    import ContextMenu from "./ContextMenu.svelte";
    import { showMenu } from "./menus";
    let x = 0;
    let y = 0;
    const hideMenu = () => {
        $showMenu = false;
    };
    const onRightClick = (e) => {
        e.preventDefault();
        window.addEventListener("click", hideMenu, false);
        $showMenu = true;
        x = e.clientX;
        y = e.clientY;
    };
    onMount(() => {
        window.addEventListener("contextmenu", onRightClick, false);
        return () => {
            window.removeEventListener("contextmenu", onRightClick, false);
            window.removeEventListener("click", hideMenu, false);
        };
    });
</script>

<p>Right click to see menu</p>
{#if $showMenu}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        role="menu"
        tabindex="0"
        class="context"
        style={`position: absolute; top: ${y}px; left: ${x}px;`}
        on:click={(e) => {
            e.stopPropagation();
        }}
    >
        <ContextMenu />
    </div>
{/if}
