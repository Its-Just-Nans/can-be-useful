<script>
    import { T, useFrame } from "@threlte/core";
    import { getPosition } from "./store";
    import { radius, rotation, diskHeight } from "./store";
    let link1;
    let link2;
    let link3;
    let tt;
    let yy;
    $: geo = [$radius, $diskHeight / 2, $diskHeight / 2];
    $: d = $radius * 0.8;
    export let num = 0;
    const debug = false;
    useFrame(() => {
        const posDown = getPosition(num);
        const angle = $rotation;
        const posUp = getPosition(num + 1);
        if (!posUp) {
            return;
        }
        [link1, link2, link3].forEach((oneLink, index) => {
            const x1 = d * Math.cos((index + 1) * ((2 * Math.PI) / 3));
            const y1 = d * Math.sin((index + 1) * ((2 * Math.PI) / 3));
            const x = x1 * Math.sin(angle) + y1 * Math.cos(angle);
            const y = x1 * Math.cos(angle) - y1 * Math.sin(angle);
            const p1x = x + posDown.x;
            const p1y = y + posDown.z;
            if (debug) {
                tt.position.x = p1x;
                tt.position.z = p1y;
            }
            const p2x = x + posUp.x;
            const p2y = y + posUp.z;
            if (debug) {
                yy.position.x = p2x;
                yy.position.z = p2y;
            }
            const teta = Math.atan2(p2y - p1y, p2x - p1x);
            oneLink.rotation.y = -teta;
            oneLink.position.x = (p1x + p2x) / 2;
            oneLink.position.z = (p1y + p2y) / 2;
        });
    });
    const size = 0.3;
</script>

<T.Mesh bind:ref={link1} position={[1, 0, 1]}>
    <T.BoxGeometry args={geo} />
    <T.MeshStandardMaterial color="green" />
</T.Mesh>
<T.Mesh bind:ref={link2} position={[1, 0, 1]}>
    <T.BoxGeometry args={geo} />
    <T.MeshStandardMaterial color="white" />
</T.Mesh>
<T.Mesh bind:ref={link3} position={[1, 0, 1]}>
    <T.BoxGeometry args={geo} />
    <T.MeshStandardMaterial color="red" />
</T.Mesh>

{#if debug}
    <T.Mesh bind:ref={tt} position={[1, 0, 1]}>
        <T.BoxGeometry args={[size, size, size]} />
        <T.MeshStandardMaterial color="orange" />
    </T.Mesh>
    <T.Mesh bind:ref={yy} position={[1, 0, 1]}>
        <T.BoxGeometry args={[size, size, size]} />
        <T.MeshStandardMaterial color="purple" />
    </T.Mesh>
{/if}
