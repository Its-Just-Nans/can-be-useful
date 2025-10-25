<script>
    import { onMount } from "svelte";
    import { T, Canvas } from "@threlte/core";
    import Box from "./Box.svelte";
    import Camera from "./Camera.svelte";
    import { clicked, rigthClicked } from "./store";

    const cols = [-9, -7, -5, -3, -1, 1, 3, 5, 7, 9];
    const delay = 250;
    const text = "";

    const handleClick = () => {
        if ($rigthClicked === true) {
            return;
        }
        if ($clicked === true) {
            return;
        }
        $clicked = !$clicked;
        setTimeout(() => {
            $clicked = !$clicked;
        }, delay);
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        $rigthClicked = !$rigthClicked;
    };

    onMount(() => {
        document.addEventListener("click", handleClick);
        document.addEventListener("contextmenu", handleRightClick);

        return () => {
            document.removeEventListener("click", handleClick);
            document.removeEventListener("contextmenu", handleRightClick);
        };
    });
</script>

<div class="threlte">
    <Canvas rendererParameters={{ powerPreference: "default" }}>
        <Camera />
        <T.DirectionalLight position={[0, 0, 1]} />
        {#each Array.from({ length: 7 }) as o, i}
            <T.Group key={i * 9}>
                {#each cols as e}
                    <Box position={[e, -4.5 + i * 1.5, 0]} {text} />
                {/each}
            </T.Group>
        {/each}
    </Canvas>
</div>

<style>
    div {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #000000;
    }
</style>
