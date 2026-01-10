export const savePosition = (name, actuelPositions = {}) => {
    if (name === "") {
        return;
    }
    let positions = window.localStorage.getItem("positions");
    if (!positions) {
        window.localStorage.setItem(
            "positions",
            JSON.stringify({
                name: actuelPositions,
            })
        );
    } else {
        positions = safeParse(positions);
        positions[name] = actuelPositions;
        window.localStorage.setItem("positions", JSON.stringify(positions));
    }
};

const safeParse = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
};

export const applyDefaultPosition = (el, name) => {
    let positions = window.localStorage.getItem("positions");
    if (!positions) {
        return;
    } else {
        positions = safeParse(positions);
        if (!positions[name]) {
            return;
        }
        el.style.top = positions[name].y + "px";
        el.style.left = positions[name].x + "px";
    }
};

export const makeDraggable = (header, elmnt, name) => {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (!header) {
        return;
    }
    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        let y = elmnt.offsetTop - pos2;
        let x = elmnt.offsetLeft - pos1;
        elmnt.style.top = y + "px";
        elmnt.style.left = x + "px";
        savePosition(name, { x, y });
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
};
