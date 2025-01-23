const makeRequest = async function (method, url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText,
            });
        };
        xhr.send();
    });
};

const generateElement = function (where = null, type, attr = null, style = null) {
    let element = document.createElement(type);
    if (style) {
        addStyle(element, style);
    }
    if (attr) {
        for (let oneAttribute in attr) {
            element[oneAttribute] = attr[oneAttribute];
        }
    }
    if (where) {
        where.appendChild(element);
    }
    return element;
};

const copy = function (param) {
    let copieur = document.createElement("textarea");
    copieur.value = param;
    copieur.innerHTML = param;
    copieur.style.width = "1px";
    copieur.style.height = "1px";
    document.body.appendChild(copieur);
    copieur.focus();
    copieur.select();
    document.execCommand("copy");
    try {
        window.getSelection().removeAllRanges();
    } catch (e) {
        console.log("Copy failed");
    }
    copieur.remove();
};

const removeAccent = function (s) {
    var r = s.toLowerCase();
    non_asciis = { a: "[àáâãäå]", ae: "æ", c: "ç", e: "[èéêë]", i: "[ìíîï]", n: "ñ", o: "[òóôõö]", oe: "œ", u: "[ùúûűü]", y: "[ýÿ]" };
    for (i in non_asciis) {
        r = r.replace(new RegExp(non_asciis[i], "g"), i);
    }
    return r;
};

const addStyle = function (HTMLelement, objectOfStyle) {
    for (let index in objectOfStyle) {
        HTMLelement.style[index] = objectOfStyle[index];
    }
};

module.exports = {
    makeRequest,
    generateElement,
    copy,
    removeAccent,
    addStyle,
};
