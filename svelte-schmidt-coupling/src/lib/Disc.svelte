<script>
    import { T, useFrame } from "@threlte/core";
    import { CylinderGeometry } from "three/src/geometries/CylinderGeometry.js";
    import { rotation } from "./store";
    import { radius, diskHeight } from "./store";

    let disc;
    $: g = new CylinderGeometry($radius, $radius, $diskHeight, 80);
    useFrame(() => {
        if (disc) {
            disc.rotation.y = $rotation;
        }
    });
</script>

<T.Mesh bind:ref={disc}>
    <T.CylinderGeometry args={[$radius, $radius, $diskHeight, 80]} />
    <T.MeshStandardMaterial color="blue" />
    <T.LineSegments>
        <T.EdgesGeometry attach="geometry" args={[g]} />
        <T.LineBasicMaterial attach="material" color="black" linewidth={2} />
    </T.LineSegments>
</T.Mesh>
