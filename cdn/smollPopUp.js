function smollPopUp(message, options, callBack) {
    /*
    options.maxTitleSize
    options.maxMsgSize
    options.popUpStyle
    options.titleStyle
    options.contentStyle
    options.type
    */
    let title = "";
    let msg = "";
    if (options.maxTitleSize) {
        title = message.title.substring(0, options.maxTitleSize) || "";
        title += "...";
    } else {
        title = message.title || "";
    }
    if (options.maxMsgSize) {
        msg = message.msg.substring(0, options.maxMsgSize) || "";
        msg += "...";
    } else {
        msg = message.msg || "";
    }
    let popUp = document.createElement("div");
    popUp.className = "smollPopUp";
    let titleOfPopUp = document.createElement("h4");
    titleOfPopUp.innerHTML = title;
    titleOfPopUp.style.margin = "0px 0px 5px 0px";
    popUp.appendChild(titleOfPopUp);
    if (options.titleStyle) {
        Object.assign(titleOfPopUp.style, options.titleStyle);
    }
    let content = document.createElement("p");
    content.innerHTML = msg;
    content.style.margin = "0px 0px 5px 0px";
    if (options.contentStyle) {
        Object.assign(content.style, options.contentStyle);
    }
    popUp.appendChild(content);
    Object.assign(popUp.style, {
        position: "fixed",
        top: "25px",
        right: "-300px",
        zIndex: 10000,
        width: "300px",
        boxSizing: "border-box",
        wordBreak: "break-work",
        borderRadius: "10px",
    });
    if (options.popUpStyle) {
        Object.assign(popUp.style, options.moreStyle);
    }
    if (options.type === "ok") {
        popUp.style.backgroundColor = "LIGHTGREEN";
    } else if (options.type === "ko") {
        popUp.style.backgroundColor = "LIGHTSALMON";
    }
    //popUp.style.height = '100px';
    let style = document.createElement("style");
    style.innerHTML = "@keyframes smollTransition {0%{transform:translate(0,0)}35%{transform:translate(-325px,0)}75%{transform:translate(-325px,0)}100%{transform:translate(10px,0)}}";
    popUp.appendChild(style);
    popUp.style.padding = "10px";
    popUp.style.animationDuration = "5s";
    popUp.style.animationName = "smollTransition";
    popUp.style.animationTimingFunction = "ease-out";
    if (callBack) {
        let button = document.createElement("button");
        const setName = (arrayOfName) => {
            button.innerHTML = arrayOfName.find(oneName => (typeof oneName !== "undefined" && oneName !== ""));
        }
        setName([
            callBack.name,
            message.button,
            "click"
        ]);
        button.addEventListener(
            "click",
            function () {
                callBack(message);
            },
            false
        );
        popUp.appendChild(button);
    }
    document.body.appendChild(popUp);
    setTimeout(() => {
        popUp.remove();
    }, 50000);
}
