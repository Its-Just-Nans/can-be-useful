<script lang="ts">
    import { onMount } from "svelte";
    import { T, useFrame } from "@threlte/core";
    import { OrbitControls } from "@threlte/extras";
    import Link from "./Link.svelte";
    import Disc from "./Disc.svelte";
    import { coords, setPosition, rotation, radius, diskHeight, speed, control, movement, onKeyDown } from "./store";
    const setPos = () => {
        $coords.x2 = $radius;
        $coords.z2 = 0;
        $coords.x3 = $radius * 2;
        $coords.z3 = 0;
        setPosition(1, { x: 0, z: 0 });
        setPosition(2, { x: $coords.x2, z: $coords.z2 });
        setPosition(3, { x: $coords.x3, z: $coords.z3 });
    };
    onMount(setPos);
    radius.subscribe(setPos);
    useFrame(() => {
        $rotation = ($rotation + $speed) % (Math.PI * 2);
    });
    let orbit;
</script>

<svelte:window
    on:keydown={(e) => {
        onKeyDown(
            { key: e.key, radius: $radius, movement: $movement },
            { x2: $coords.x2, z2: $coords.z2, x3: $coords.x3, z3: $coords.z3 }
        );
    }}
/>

<T.AmbientLight />
<T.PerspectiveCamera
    makeDefault
    position={[0, 10, 10]}
    on:create={({ ref }) => {
        ref.lookAt(0, 0, 0);
    }}
>
    <OrbitControls bind:this={orbit} enableZoom={$control} />
</T.PerspectiveCamera>
<Disc />
<T.Group position.y={$diskHeight / 2 + $diskHeight / 4}>
    <Link num={1} />
</T.Group>
<T.Group position.y={($diskHeight / 2) * 3}>
    <T.Group position.y={$diskHeight / 2 + $diskHeight / 4}>
        <Link num={2} />
    </T.Group>
    <T.Group position.x={$coords.x2} position.z={$coords.z2}>
        <Disc />
    </T.Group>
</T.Group>
<T.Group position.y={($diskHeight / 2) * 6} position.x={$coords.x3} position.z={$coords.z3}>
    <Disc />
</T.Group>
