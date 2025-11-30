function makePopUp(objectWanted, property) {
    return new Promise((resolve) => {
        let popUp = document.createElement("div");
        addStyle(popUp, {
            position: "absolute",
            width: "100vw",
            height: "100vh",
            top: "0px",
            right: "0px",
        });
        let exterior = document.createElement("div");
        addStyle(exterior, {
            position: "absolute",
            width: "100vw",
            height: "100vh",
            top: "0px",
            right: "0px",
            backgroundColor: "rgba(0,0,0,0.5)",
        });
        popUp.appendChild(exterior);
        exterior.onclick = function () {
            if (true) {
                popUp.remove();
            }
        };
        document.body.appendChild(popUp);
        let interior = document.createElement("div");
        addStyle(interior, {
            position: "absolute",
            width: "50vw",
            height: "50vh",
            margin: "25vh 25vw 25vh 25vw",
            backgroundColor: "white",
            font: "1em 'Fira Sans', sans-serif",
            borderRadius: "10px",
            boxSizing: "border-box",
        });
        popUp.appendChild(interior);
        let head = document.createElement("div");
        addStyle(head, {
            position: "absolute",
            width: "100%",
            top: "50px",
            padding: "10px",
            borderTop: "1px solid black",
            boxSizing: "border-box",
        });
        interior.appendChild(head);
        let body = document.createElement("div");
        addStyle(body, {
            position: "absolute",
            width: "100%",
            top: "51px",
            bottom: "51px",
            padding: "10px",
            boxSizing: "border-box",
        });
        interior.appendChild(body);
        let footer = document.createElement("div");
        addStyle(footer, {
            position: "absolute",
            width: "100%",
            bottom: "0px",
            height: "50px",
            padding: "10px",
            borderTop: "1px solid black",
            boxSizing: "border-box",
            textAlign: "center",
        });
        interior.appendChild(footer);
        submit = document.createElement("button");
        submit.innerHTML = "Submit";
        submit.onclick = function () {
            for (let oneElement in objectWanted) {
                for (let oneChild of body.childNodes) {
                    if (oneChild.localName == "input") {
                        if (oneChild.name == oneElement) {
                            objectWanted[oneElement] = oneChild.value;
                        }
                    }
                }
            }
            popUp.remove();
            resolve(objectWanted);
        };
        footer.appendChild(submit);
        for (let element in objectWanted) {
            let content = objectWanted[element];
            if (typeof content === "object" && content !== null) {
                //it's an object
            } else {
                //it's not an object
                let input = document.createElement("input");
                let label = document.createElement("label");
                label.innerHTML = element;
                input.value = content;
                input.name = element;
                body.appendChild(label);
                body.appendChild(document.createElement("br"));
                body.appendChild(input);
                body.appendChild(document.createElement("br"));
                body.appendChild(document.createElement("br"));
            }
        }
    });
}

function loadCard(cardData, language) {
    let correctText;
    let oldCard = document.getElementById("card");
    oldCard.id = "oldCard";
    oldCard = document.getElementById("oldCard");
    oldCard.style.zIndex = "1";
    let card = oldCard.cloneNode(true);
    card.id = "card";
    card.style.transform = "translate(-1000px,0)";
    document.getElementById("content").appendChild(card);
    card = document.getElementById("card");
    if (!cardData["content"][language] && cardData["title"][language]) {
        language = "fr";
    }
    let front = card.getElementsByClassName("front")[0];
    let back = card.getElementsByClassName("back")[0];

    let CARDtitle = generateElement(front, "h2", { id: "card-title" });
    CARDtitle.innerHTML = cardData["title"][language];

    let CARDcontent = generateElement(front, "p", { id: "card-content" });
    correctText = getCorrectText(cardData["content"], language);
    CARDcontent.innerHTML = correctText;
    CARDcontent.style.textAlign = "initial";

    let CARDBackTitle = generateElement(back, "h2", { id: "card-baclk-title" });
    if (cardData["quizz"][0]["type"]) {
        CARDBackTitle.innerHTML = "Quizz - " + cardData["quizz"][0]["type"];
    } else {
        CARDBackTitle.innerHTML = "No quizz";
    }

    let CARDquizz = generateElement(back, "div", { id: "card-quizz" });
    CARDquizz.innerHTML = "";
    CARDquizz.style.textAlign = "left";
    if (cardData["quizz"][0]["type"] == "qcm") {
        let CARDBackQuestion = generateElement(CARDquizz, "h3", { id: "card-back-title" });
        CARDBackQuestion.innerHTML = cardData["quizz"][0]["question"];
        CARDBackQuestion.style.textAlign = "center";
        let count = 0;
        for (answer of cardData["quizz"][0]["answers"]) {
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = count;
            checkbox.id = "quizz" + count;
            let label = document.createElement("label");
            label.innerHTML = answer;
            label.setAttribute("for", "quizz" + count);
            let br = document.createElement("br");
            CARDquizz.appendChild(checkbox);
            CARDquizz.appendChild(label);
            CARDquizz.appendChild(br);
            count++;
        }
        let br = document.createElement("br");
        CARDquizz.appendChild(br);
        let correct = document.createElement("button");
        correct.innerHTML = "Corriger";
        correct.style.textAlign = "center";
        CARDquizz.appendChild(correct);
        let checkCorrection = function () {
            let final = false;
            let long = cardData["quizz"][0]["answers"].length;
            for (let index = 0; index < long; index++) {
                let element = document.getElementById("quizz" + index);
                if (cardData["quizz"][0]["correct-answers"].includes(index)) {
                    if (element.checked == true) {
                        final = true;
                    } else {
                        final = false;
                        break;
                    }
                } else {
                    if (element.checked == false) {
                        final = true;
                    } else {
                        final = false;
                        break;
                    }
                }
            }
            if (final) {
                smollPopUp({ title: "Bonne réponse" }, { type: "ok" });
            } else {
                smollPopUp({ title: "Mauvaise réponse" }, { type: "ko" });
            }
        };
        correct.addEventListener("click", checkCorrection, false);
    }
    let style = document.createElement("style");
    style.innerHTML = "@keyframes cardTransition {0%{transform:translate(-1000px,0)}100%{transform:translate(0,0)}}";
    card.appendChild(style);
    card.style.zIndex = "10000";
    let time = 2;
    card.style.animationDuration = time + "s";
    card.style.animationName = "cardTransition";
    card.style.animationTimingFunction = "ease-out";
    card.style.transform = "";
    setTimeout(() => {
        while (document.getElementById("oldCard")) {
            document.getElementById("oldCard").remove();
        }
        style.remove();
        card.style.animationDuration = "";
        card.style.animationName = "";
        card.style.animationTimingFunction = "";
    }, time * 1000);
}

function getCorrectText(value, lang) {
    let result = "";
    if (value["contentType"]) {
        if (value["contentType"] == "readme") {
            let converter = new showdown.Converter();
            converter.setFlavor("github");
            result = converter.makeHtml(value[lang]);
            document.querySelectorAll("pre code").forEach((block) => {
                hljs.highlightBlock(block);
            });
        } else {
            //other content type ?
        }
    } else {
        result = value[lang];
    }
    return result;
}

function downloadObjectAsJson(exportObj, exportName) {
    //https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function renderTableau(where, theadData) {
    let table = generateElement(where, "table", { id: "tableau" });
    let thead = generateElement(table, "thead", { id: "tableauHead" });
    let tbody = generateElement(table, "tbody", { id: "tableauBody" });
    let tfoot = generateElement(table, "tfoot", { id: "tableauFoot" });
    if (theadData) {
        let tr = document.createElement("tr");
        for (oneElement of theadData) {
            generateElement(tr, "th", { innerHTML: oneElement });
        }
        thead.append(tr);
    }
    return {
        table: table,
        tbody: tbody,
        thead: thead,
        tfoot: tfoot,
    };
}

function renderCards(content) {
    let buttonPrevious = document.createElement("button");
    buttonPrevious.innerHTML = "<-";
    buttonPrevious.onclick = function () {
        if (document.getElementById("card").className.includes("flipped")) {
            document.getElementById("card").className = document.getElementById("card").className.replace(" flipped", "");
        }
        if (indexing - 1 >= 0) {
            indexing = indexing - 1;
            loadCard(allCards["cards"][indexing], lang);
        }
    };
    content.appendChild(buttonPrevious);
    let buttonNext = document.createElement("button");
    buttonNext.innerHTML = "->";
    buttonNext.onclick = function () {
        if (document.getElementById("card").className.includes("flipped")) {
            document.getElementById("card").className = document.getElementById("card").className.replace(" flipped", "");
        }
        if (indexing + 1 < allCards["cards"].length) {
            indexing = indexing + 1;
            loadCard(allCards["cards"][indexing], lang);
        }
    };
    content.appendChild(buttonNext);
    let buttonFlip = document.createElement("button");
    buttonFlip.innerHTML = "flip card";
    buttonFlip.onclick = function () {
        let classes = document.getElementById("card").className.split(" ");
        if (document.getElementById("card").className.includes("flipped")) {
            document.getElementById("card").className = document.getElementById("card").className.replace(" flipped", "");
        } else {
            document.getElementById("card").className += " flipped";
        }
    };
    content.appendChild(buttonFlip);
    let card = generateElement(content, "div", { id: "card", className: "card" });
    generateElement(card, "div", { className: "front" });
    generateElement(card, "div", { className: "back" });
}
