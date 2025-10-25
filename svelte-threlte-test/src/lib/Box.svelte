<script>
    import { T, useFrame } from "@threlte/core";
    import { Text } from "@threlte/extras";
    import { Color, Vector4, Vector3 } from "three";
    import { interactivity } from "@threlte/extras";
    import { clicked, rigthClicked } from "./store";
    const { pointer } = interactivity();

    let r;
    const defaultText = "o";
    const black = new Color("black");
    const lime = new Color("lime");
    let hovered = false;
    const vec = new Vector4();
    const setHovered = (ns) => {
        hovered = ns;
    };
    export let position;
    export let text = "";

    useFrame((u) => {
        u.renderer.getViewport(vec);
        const ratio = u.renderer.getPixelRatio();
        const width = vec.z * ratio;
        const height = vec.w * ratio;
        const tempTarget = new Vector3();
        const position = new Vector3();
        const distance = u.camera.current.getWorldPosition(position).distanceTo(tempTarget);
        const fov = (u.camera.current.fov * Math.PI) / 180; // convert vertical fov to radians
        const h = 2 * Math.tan(fov / 2) * distance; // visible height
        const w = h * (width / height);

        if (r) {
            const x = (pointer.current.x * w) / 2.5;
            const y = (pointer.current.y * h) / 2.5;
            r.lookAt(x, y, 1);
            r.material.color.lerp($clicked ? lime : hovered ? lime : black, 0.05);
        }
    });
    clicked.subscribe((val) => {
        if (val) {
            // lime.copy(new Color(getRandomColor()));
            const val = 5;
            lime.sub(new Color(`#${val}0${val}0${val}0`));
        }
    });
    rigthClicked.subscribe((val) => {
        if (val) {
            text = defaultText;
        } else {
            text = "";
        }
    });
</script>

<T.Group {position}>
    <T.Mesh
        on:create={({ ref }) => {
            r = ref;
        }}
        on:pointerover={() => setHovered(true)}
        on:pointerout={() => setHovered(false)}
    >
        <T.BoxGeometry />
        <T.MeshStandardMaterial color={lime} />
        <T.Group position.z={0.5001}>
            <Text {text} characters={text} color="white" fontSize={0.25} anchorX="50%" anchorY="50%" />
        </T.Group>
    </T.Mesh>
</T.Group>
