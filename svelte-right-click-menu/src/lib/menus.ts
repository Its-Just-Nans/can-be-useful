import { writable } from "svelte/store";
import GithubIcon from "./GithubIcon.svelte";
import CubeIcon from "./CubeIcon.svelte";

export const menus = [
    [
        {
            ico: "👨‍💻",
            link: "https://n4n5.dev/can-be-useful/html-css-editor",
            title: "CSS Editor",
            subtitle: null,
        },
        {
            ico: "🎒",
            link: "https://n4n5.dev/can-be-useful/svelte-pack-your-bag",
            title: "Pack your bag",
            subtitle: null,
        },
        {
            ico: "🎨",
            link: "https://n4n5.dev/can-be-useful/svelte-not-paint",
            title: "NotPaint",
            subtitle: null,
        },
        {
            ico: "📺",
            link: "https://n4n5.dev/can-be-useful/svelte-time-based-animation",
            title: "Time based animation",
            subtitle: null,
        },
        {
            ico: "👀",
            link: "https://n4n5.dev/can-be-useful/svelte-threlte-test",
            title: "Threlte",
            subtitle: null,
        },
        {
            ico: "⚙️",
            link: "https://n4n5.dev/can-be-useful/svelte-schmidt-coupling",
            title: "Schmidt coupling",
            subtitle: null,
        },
        {
            ico: CubeIcon,
            link: "https://n4n5.dev/can-be-useful/svelte-3d-rotation",
            title: "3D rotation",
            subtitle: "",
        },
        {
            ico: "🧮",
            link: "https://its-just-nans.github.io/function-viewer/",
            title: "Function viewer",
            subtitle: null,
        },
        {
            ico: "🌐",
            link: "https://its-just-nans.github.io/domains/",
            title: "Domains",
            subtitle: null,
        },
    ],
    [
        {
            ico: GithubIcon,
            link: "https://github.com/Its-Just-Nans",
            title: "Its-Just-Nans",
            subtitle: "",
        },
    ],
];

export const showMenu = writable(false);
