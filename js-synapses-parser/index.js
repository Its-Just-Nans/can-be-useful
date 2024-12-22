const jsdom = require("jsdom");
const { JSDOM } = jsdom;

f = require("fs").readFileSync("a.html").toString();
const dom = new JSDOM(f);

const a = dom.window.document.getElementsByClassName("content ldap-search-results-wrapper")[0];
const res = [...a.children].map((b) => {
    const name = b.getElementsByClassName("person-full-name")[0].innerHTML || "";
    const fonction = b.getElementsByClassName("person-fonction")[0].innerHTML || "";
    let t;
    let service = "";
    if ((t = b.getElementsByClassName("person-service")) && (t = t[0]) && (t = t.childNodes) && (t = t[1])) {
        service = t.innerHTML || "";
    }
    let email = "";
    if ((t = b.getElementsByClassName("person-email")) && (t = t[0]) && (t = t.childNodes) && (t = t[1])) {
        email = t.innerHTML || "";
    }
    let image = "";
    if ((t = b.getElementsByClassName("ldap-search-result-photo"))) {
        if ((t = t[0]) && t.childNodes) {
            if ((t = t.childNodes[1])) {
                if (t) {
                    image = t.src || "";
                }
            }
        }
    }
    return {
        name,
        fonction,
        service,
        email,
        image,
    };
});

let g = JSON.stringify(res, null, 4);

require("fs").writeFileSync("data.json", g);
