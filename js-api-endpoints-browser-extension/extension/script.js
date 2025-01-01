const text = document.getElementById("text");
const port = chrome.runtime.connect({
    name: "communication",
});
port.onMessage.addListener(function (msg) {
    text.innerHTML += JSON.stringify(msg);
});
