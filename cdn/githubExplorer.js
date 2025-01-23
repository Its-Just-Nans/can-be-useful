/*
Require :
    const githubName = "";
    const repoName   = "";
    document.getElementById("dataTableTitle");
    document.getElementById("dataTable");
Feature :
const startPath = "";
*/

var baseLink;
var linkForStart;
var dataTable = document.getElementById("dataTable");
startRender();

function startRender() {
    if (typeof githubName === "undefined" || typeof repoName === "undefined") {
        //we wait before retry
        setTimeout(function () {
            startRender();
        }, 1000);
    } else {
        if (typeof path !== "undefined") {
            baseLink = path;
        } else {
            baseLink = `https://api.github.com/repos/${githubName}/${repoName}/contents/`;
        }
        if (typeof startPath !== "undefined") {
            linkForStart = startPath;
        } else {
            linkForStart = baseLink;
        }
        document.getElementById("dataTableTitle").innerHTML = `Exploring ${repoName} of ${githubName}`;
        generateTable(linkForStart);
    }
}

async function generateTable(url) {
    //not optimized because we reload all the table
    dataTable.innerHTML = "";
    if (url != baseLink) {
        let firstLine = document.createElement("tr");
        function onClickFunction(event) {
            let backLink = url.split("/");
            if (backLink[backLink.length - 1] == "") {
                backLink.pop();
                backLink.pop();
            } else {
                backLink.pop();
            }
            backLink = backLink.join("/") + "/";
            generateTable(backLink);
        }
        generateElement(firstLine, "td", { onclick: onClickFunction, innerHTML: ".." });
        generateElement(firstLine, "td", { onclick: onClickFunction });
        generateElement(firstLine, "td", { onclick: onClickFunction });
        generateElement(firstLine, "td", { onclick: onClickFunction });
        generateElement(firstLine, "td", { onclick: onClickFunction });
        dataTable.appendChild(firstLine);
    }
    const response = await fetch(url).catch(function (error) {
        console.log(error);
    });
    if (!response) {
        generateTable(linkForStart);
        return;
    }
    const fileInDir = await response.json();
    if (!Array.isArray(fileInDir)) {
        generateTable(linkForStart);
        return;
    }
    for (let oneFile of fileInDir) {
        function onClickRow(event) {
            let element = this.parentNode;
            if (element.children[3].innerHTML == "file") {
                window.open(oneFile["html_url"]);
            } else {
                generateTable(linkForStart + oneFile["path"]);
            }
        }
        let line = document.createElement("tr");
        let inner;
        if (oneFile.type == "file") {
            inner =
                '<svg aria-label="File" height="16" viewBox="0 0 16 16" version="1.1" width="16" role="img"><path fill-rule="evenodd" d="M3.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06zM2 1.75C2 .784 2.784 0 3.75 0h5.086c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v8.086A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25V1.75z"></path></svg>';
        } else {
            inner =
                '<svg aria-label="Directory" height="16" viewBox="0 0 16 16" version="1.1" width="16" role="img"><path fill-rule="evenodd" d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3h-6.5a.25.25 0 01-.2-.1l-.9-1.2c-.33-.44-.85-.7-1.4-.7h-3.5z"></path></svg>';
        }
        generateElement(line, "td", { onclick: onClickRow, innerHTML: inner }); //add name
        generateElement(line, "td", { onclick: onClickRow, innerHTML: oneFile.name }); //add name
        generateElement(line, "td", { onclick: onClickRow, innerHTML: `${oneFile.size} bytes` }); //add size
        generateElement(line, "td", { onclick: onClickRow, innerHTML: oneFile.type }); //add type
        generateElement(line, "td", { onclick: onClickRow, innerHTML: oneFile.path }); //add path
        dataTable.appendChild(line);
    }
}
