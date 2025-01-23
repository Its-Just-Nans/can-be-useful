/*
requirement example :

const NAME_OF_PROJECT = "rt";
const DEFAULT_FILE = "search.html";
const DEFAULT_HASH = "#search";
const DOMAIN_NAME = "https://its-just-nans.github.io";

Options :

const OPTIONS_showdown: see https://github.com/showdownjs/showdown#options
*/

if (!NAME_OF_PROJECT) {
    console.error("NAME_OF_PROJECT undefined");
}
if (!DEFAULT_FILE) {
    console.error("DEFAULT_FILE undefined");
}
if (!DEFAULT_HASH) {
    console.error("DEFAULT_HASH undefined");
}
if (!DOMAIN_NAME) {
    console.error("DOMAIN_NAME undefined");
}

let optionsConverter;
if (typeof OPTIONS_showdown !== "undefined") {
    optionsConverter = OPTIONS_showdown;
} else {
    optionsConverter = {
        openLinksInNewWindow: true,
    };
}

function checkStyleOfNav() {
    let navBlock = document.getElementsByTagName("nav")[0];
    let ulNav = navBlock.getElementsByTagName("ul")[0];
    if (ulNav.className == "") {
        ulNav.className = "open-nav";
    } else {
        ulNav.className = "";
    }
}

function setResponsive() {
    let navBlock = document.getElementsByTagName("nav")[0];
    let ulNav = navBlock.getElementsByTagName("ul")[0];
    ulNav.className = "open-nav";
    if (window.innerWidth <= 1050) {
        ulNav.className = "";
        navBlock.addEventListener("click", checkStyleOfNav, false);
    } else {
        navBlock.removeEventListener("click", checkStyleOfNav, false);
    }
}

setResponsive();
window.onresize = setResponsive;

function getNavLinks() {
    let links = [];
    [...document.getElementById("nav-list").children].forEach((element) => {
        if (element.localName == "li") {
            links.push(element.childNodes[0].href);
        }
    });
    return links;
}

const NAVIGATION_LINKS = getNavLinks();

window.onhashchange = function (event) {
    const newURL = event.newURL;
    if (event.oldURL != newURL) {
        //to prevent useless request (when the user click on the link to the actual page)
        //smollPopUp({title : "You're dumb", msg : 'Why are you clicking the same page ?!'}, { type: 'ko'});
        for (let oneLink of NAVIGATION_LINKS) {
            if (newURL == oneLink) {
                displayNewPage();
                break;
            }
        }
    }
};

function startNav() {
    let actualHash = window.location.hash;
    let newHash = "";
    if (actualHash !== "") {
        for (let oneLink of NAVIGATION_LINKS) {
            if (oneLink.endsWith(actualHash)) {
                newHash = `#${oneLink.split("#")[1]}`;
                break;
            }
        }
    }
    if (newHash !== "") {
        displayNewPage(newHash);
    } else {
        window.location.hash = DEFAULT_HASH;
    }
}

startNav();

function displayNewPage(link) {
    let basePage;
    //check if it's in local
    if (window.location.origin === DOMAIN_NAME) {
        basePage = window.location.origin + `/${NAME_OF_PROJECT}/files/`;
    } else {
        basePage = window.location.origin + "/files/";
    }
    if (window.location.hash == "" && !link) {
        //if there is nothing, we load to the default file
        basePage += DEFAULT_FILE;
    } else {
        let linkToFile;
        if (!link) {
            linkToFile = window.location.hash;
        } else {
            linkToFile = link;
        }
        if (linkToFile.startsWith("#readme-")) {
            basePage += linkToFile.replace("#readme-", "") + ".md";
        } else {
            basePage += linkToFile.replace("#", "") + ".html";
        }
    }
    if (basePage != "") {
        loadNewPage(basePage);
    }
}

function loadNewPage(url) {
    makeRequest("GET", url)
        .then(function (response) {
            let scriptImported = document.getElementsByClassName("scriptImported");
            while (scriptImported.length != 0) {
                scriptImported[0].remove();
            }
            if (window.location.hash.startsWith("#readme-")) {
                //if it's a readme we need to render it
                document.getElementById("contenuMain").innerHTML = '<div id="globalReadMe"></div>';
                let render = function () {
                    if (typeof showdown !== "undefined") {
                        let converter = new showdown.Converter(optionsConverter);
                        converter.setFlavor("github");
                        let html = converter.makeHtml(response);
                        document.getElementById("globalReadMe").innerHTML = html;
                        document.querySelectorAll("pre code").forEach((block) => {
                            hljs.highlightBlock(block);
                        });
                    } else {
                        setTimeout(function () {
                            render();
                        }, 100);
                    }
                };
                render();
            } else {
                document.getElementById("contenuMain").innerHTML = response;
                let allScripts = document.getElementById("contenuMain").getElementsByTagName("script");
                for (let script of allScripts) {
                    if (script.innerHTML == "") {
                        generateElement(document.body, "script", { src: script.src, className: "scriptImported" });
                    } else {
                        generateElement(document.body, "script", { innerHTML: script.innerHTML, className: "scriptImported" });
                        //eval(script.innerHTML);
                    }
                }
                let allStyle = document.getElementById("contenuMain").getElementsByTagName("style");
                for (let oneStyle of allStyle) {
                    if (oneStyle.innerHTML == "") {
                        let number = document.getElementsByTagName("style").length;
                        let newStyle = document.createElement("link");
                        document.getElementsByTagName("style")[number - 1].after(newStyle);
                        newStyle.rel = "stylesheet";
                        let re = /src=".*"/;
                        let lien = oneStyle.outerHTML.match(re)[0];
                        lien = lien.substring(5, lien.length - 1);
                        newStyle.href = lien;
                    } else {
                        //good ?
                    }
                }
            }
        })
        .catch(function (error) {
            console.log("PAGE-LOADER :");
            console.log(error);
        });
}
