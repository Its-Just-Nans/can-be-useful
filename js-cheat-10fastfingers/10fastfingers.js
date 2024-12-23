setInterval(() => {
    let a = document.getElementById("inputfield");
    let word = document.getElementsByClassName("highlight")[0];
    if (word && word.innerHTML) {
        a.value = word.innerHTML;
        a.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 32, which: 32 }));
        a.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 32, which: 32 }));
    }
}, 250);
