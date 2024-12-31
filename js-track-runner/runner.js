let mydiv = document.createElement("div");
mydiv.setAttribute(
    "style",
    "position: fixed;width: 50vw;margin-top: 12.5vw;margin-left: 25vw;z-index: 100000;background-color: ALICEBLUE;border: 1px solid black;text-align:center;"
);
mydiv.setAttribute("id", "divFromBookMark");
document.body.before(mydiv);

let c = document.createElement("input");
c.type = "number";
c.setAttribute("id", "entree");
mydiv.append(c);
mydiv.append(document.createElement("BR"));

let d = document.createElement("button");
d.innerHTML = "Ajouter le coureur";
mydiv.append(d);
d.addEventListener(
    "click",
    function () {
        setFav(parseInt(c.value, 10), !0);
    },
    false
);
mydiv.append(document.createElement("BR"));

let autreButton = document.createElement("button");
autreButton.innerHTML = "Recharger les coureurs enregistrés";
mydiv.append(autreButton);
autreButton.addEventListener("click", charger, false);

let smsButton = document.createElement("button");
smsButton.innerHTML = "Générer le SMS";
mydiv.append(smsButton);
smsButton.addEventListener("click", generate, false);

function generate() {
    let liste =
        document.getElementById("scrollZone").childNodes[0].childNodes[0].childNodes[0].childNodes[3].childNodes;
    let compteur = 0;
    let varFinal = new Date() + "\n";
    //console.log(liste);
    for (let item in liste) {
        if (compteur % 2 != 0) {
            if (typeof liste[compteur] !== "undefined") {
                //console.log(liste[compteur]);
                varFinal +=
                    liste[compteur].cells[3].innerHTML +
                    "->" +
                    liste[compteur].cells[6].innerHTML.replace(/\s/g, "") +
                    "\n";
            }
        }
        //console.log(compteur);
        compteur++;
    }
    //console.log(liste);
    sms = document.createElement("pre");
    sms.setAttribute("style", "border:1px solid black");
    sms.setAttribute("contenteditable", "true");
    sms.setAttribute("onfocus", "document.execCommand('selectAll',false,null)");
    mydiv.append(sms);
    sms.innerHTML = varFinal;
    let copierButton = document.createElement("button");
    copierButton.innerHTML = "Copier le texte";
    mydiv.append(copierButton);
    copierButton.addEventListener("click", myFunction, false);
}

function myFunction() {
    sms.focus();
    document.execCommand("copy");
    alert("Copied");
}

function charger() {
    setFav(515, true);
    setFav(86, true);
    setFav(107, true);
    setFav(207, true);
    setFav(335, true);
    setFav(341, true);
    setFav(365, true);
    setFav(511, true);
    setFav(389, true);
    setFav(399, true);
    setFav(50, true);
    setFav(112, true);
    setFav(131, true);
    setFav(484, true);
    setFav(196, true);
    setFav(7, true);
    setFav(481, true);
    setFav(303, true);
    setFav(3, true);
    setFav(11, true);
    setFav(2, true);
    setFav(435, true);
}

function setFav(d, b) {
    var $fav = $.cookie("favoris");
    var $favs = typeof $fav != "undefined" && $fav ? $fav.split(/,/) : new Array();
    if (b) {
        $favs.push("" + d);
        $(".fav[data-dos=" + d + "]").show();
        $(".nofav[data-dos=" + d + "]").hide();
    } else {
        var idx = $.inArray("" + d, $favs); //$favs.indexOf(''+d);
        if (idx >= 0) {
            $favs.splice(idx, 1);
            $(".fav[data-dos=" + d + "]").hide();
            $(".nofav[data-dos=" + d + "]").show();
        }
    }
    $.cookie("favoris", $favs.join(","), { expires: 30 });
}
