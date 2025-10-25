<script>
    import { T, useThrelte, useFrame } from "@threlte/core";
    import { Vector3 } from "three";
    import { OrbitControls, interactivity } from "@threlte/extras";
    import { rigthClicked } from "./store";

    const { pointer } = interactivity();
    const { invalidate } = useThrelte();
    const { camera } = useThrelte();
    const vec = new Vector3();
    let enableZoom = true;
    let el = enableZoom ? document.querySelector(".threlte") : document.createElement("div");
    let r;
    useFrame(() => {
        if (!enableZoom && r) {
            r.position.lerp(vec.set(pointer.current.x, pointer.current.y, camera.current.position.z), 0.05);
            camera.current.lookAt(0, 0, 0);
        }
    });
    rigthClicked.subscribe((v) => {
        enableZoom = v;
        el = v ? document.querySelector(".threlte") : document.createElement("div");
    });
</script>

<T.PerspectiveCamera
    position={[0, 0, 10]}
    on:create={({ ref }) => {
        ref.lookAt(0, 0, 0);
    }}
    makeDefault
    bind:ref={r}
>
    <OrbitControls on:change={invalidate} {enableZoom} args={[r, el]} />
</T.PerspectiveCamera>
