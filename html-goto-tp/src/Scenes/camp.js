import * as PANOLENS from "panolens";
import { Menus } from "../constants";

export const init = (viewer, panorama) => {
    viewer.add(panorama);
    viewer.setPanorama(panorama);
    let infospot2 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
    infospot2.position.set(8000, 0, 300);
    infospot2.addEventListener("click", function () {
        window.location.hash = Menus.VALLEY;
    });
    panorama.add(infospot2);
    let infospot3 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
    infospot3.position.set(-9000, 500, -100);
    infospot3.addEventListener("click", function () {
        window.location.hash = Menus.CACTUS;
    });
    panorama.add(infospot3);
};
