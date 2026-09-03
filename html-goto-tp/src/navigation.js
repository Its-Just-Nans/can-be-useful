import Camp from "./Scenes/Camp.svelte";
import { Menus } from "./constants";

const menus = [
    {
        hash: Menus.CAMP,
        component: Camp,
    },
];

export const onhashchange = () => {
    const newHash = window.location.hash.substring(1);
    let correctMenu = menus.find((el) => {
        return el.hash == newHash;
    });
    if (!correctMenu) {
        correctMenu = menus[0];
    }
    return correctMenu.component;
};
