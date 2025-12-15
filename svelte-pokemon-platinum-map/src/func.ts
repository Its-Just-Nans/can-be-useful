let isDragging = false;
let startX = 0;
let startY = 0;
let mapX = 0;
let mapY = 0;

export const getMapContainer = () => {
    return document.getElementById("map-container")!;
};

export const moveAll = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    mapX += dx;
    mapY += dy;

    document.getElementById("map")!.style.transform = `translate(${mapX}px, ${mapY}px)`;

    startX = e.clientX;
    startY = e.clientY;
};

export const mouseUp = () => {
    isDragging = false;
    getMapContainer().style.cursor = "grab";
};

export const mouseDown = (e) => {
    isDragging = true;
    // parse translate
    const style = e.currentTarget.style;
    const transform = style.transform;

    const match = transform.match(/translate\((-*\d+)px, (-*\d+)px\)/);
    let elementX = 0;
    let elementY = 0;
    if (match) {
        elementX = parseInt(match[1]);
        elementY = parseInt(match[2]);
    }
    startX = e.clientX - elementX;
    startY = e.clientY - elementY;
    e.currentTarget.style.cursor = "grabbing";
};

export const clickImg = (e) => {
    e.preventDefault();
    isDragging = false;
    e.currentTarget.style.zIndex = 1000;
    if (!e.fake) {
        const obj = [
            {
                image: e.currentTarget.id,
                style: {
                    transform: e.currentTarget.style.transform,
                    zIndex: e.currentTarget.style.zIndex,
                },
            },
        ];
        console.log(JSON.stringify(obj, null, 4));
    }
    e.currentTarget.style.cursor = "grab";
    getMapContainer().addEventListener("mousedown", mouseDown, false);
    document.addEventListener("mousemove", moveAll, false);
    document.addEventListener("mouseup", mouseUp, false);
    e.currentTarget.removeEventListener("mousemove", mousemoveImg, false);
    e.currentTarget.removeEventListener("click", clickImg);
};

export const mousemoveImg = (e) => {
    e.preventDefault();
    e.currentTarget.style.cursor = "grabbing";
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    e.currentTarget.style.transform = `translate(${dx}px, ${dy}px)`;
};
