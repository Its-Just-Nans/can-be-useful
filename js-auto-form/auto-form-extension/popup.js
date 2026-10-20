import { ping, log, setToken, sendForm } from "./routes.js";
import { modifyDOM, fillDOM } from "./injection.js";

const button = document.getElementById("changeColor");
const bigContent = document.getElementById("big-content");
const defaultPart = document.getElementById("default-part");
const messagePart = document.getElementById("message-part");
messagePart.style.display = "none";
document.getElementById("result-details").style.display = "none";
const passwordPart = document.getElementById("password-part");
const result = document.getElementById("result");

button.addEventListener("click", async function (event) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id, allFrames: true },
            function: modifyDOM,
        },
        async (results) => {
            let res = {};
            if (typeof results !== "undefined" && results && results[0]) {
                res = results[0].result;
            }
            document.getElementById("result-text").innerHTML = `${res.length} formulaire${res.length > 1 ? "s" : ""
                } détecté${res.length > 1 ? "s" : ""}`;
            result.innerHTML = JSON.stringify(res, null, 4);
            document.getElementById("result-details").style.display = "block";
            const resp = await sendForm(res);
            if (resp && resp.data) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id },
                        function: fillDOM,
                        args: [resp.data],
                    },
                    (resultsFunctionFill) => {
                        let resultFill = [];
                        if (
                            typeof resultsFunctionFill !== "undefined" &&
                            resultsFunctionFill &&
                            resultsFunctionFill[0]
                        ) {
                            resultFill = resultsFunctionFill[0].result;
                        }
                        const tab = document.getElementById("tab-res");
                        const p = document.createElement("p");
                        p.innerHTML = "Resultats :";
                        tab.appendChild(p);
                        resultFill.forEach((element) => {
                            const e = document.createElement("div");
                            const span = document.createElement("span");
                            span.innerHTML = `${element.name} : ${element.value}`;
                            const button = document.createElement("button");
                            button.innerHTML = "Copier";
                            button.onclick = () => {
                                navigator.clipboard.writeText(element.value).then(
                                    () => {
                                        document.getElementById("big-content").style.backgroundColor = "lawngreen";
                                        setTimeout(() => {
                                            document.getElementById("big-content").style.backgroundColor = "green";
                                        }, 100);
                                        setTimeout(() => {
                                            document.getElementById("big-content").style.backgroundColor = "lawngreen";
                                        }, 200);
                                        setTimeout(() => {
                                            document.getElementById("big-content").style.backgroundColor = "green";
                                        }, 300);
                                    },
                                    () => {
                                        //clipboard write failed, use fallback
                                    }
                                );
                            };
                            e.appendChild(span);
                            e.appendChild(button);
                            tab.appendChild(e);
                        });
                    }
                );
            }
        }
    );
});

const addPassword = () => {
    defaultPart.style.display = "none";
    passwordPart.style.display = "block";
    document.getElementById("set-password").onclick = async () => {
        const newPass = document.getElementById("password-input").value;
        await chrome.storage.local.set({ password: newPass });
        defaultPart.style.display = "block";
        passwordPart.style.display = "none";
        startLog();
    };
};

const startLog = () => {
    log().then((data) => {
        if (data && data.infos && data.infos.code === "INCORRECT_PASSWORD") {
            document.getElementById("password-txt").innerHTML = "Bad password";
            addPassword();
        } else if (typeof data === "string" && data === "NO_PASS") {
            addPassword();
        } else if (data && typeof data.data === "string") {
            setToken(data.data);
            bigContent.style.backgroundColor = "green";
        } else {
            ping()
                .catch(() => { })
                .then((data) => {
                    if (!data) {
                        // no answer
                        bigContent.style.backgroundColor = "red";
                        defaultPart.style.display = "none";
                        messagePart.style.display = "block";
                        messagePart.childNodes[1].innerHTML = "Application is not open";
                    } else {
                        document.getElementById("password-txt").innerHTML = "There is an error with the connection";
                        addPassword();
                    }
                });
        }
    }).catch((e) => {
        addPassword();
    })
};
startLog();

// var popupWindow = window.open(
//     chrome.runtime.getURL("popup.html"),
//     "exampleName",
//     "width=400,height=400"
// );
