
var valeur = document.querySelectorAll('img');

for (var piou of valeur) {
    console.log(piou.src);
    openInNewTab(piou.src);
    console.log('Ouverture ' + piou.src);
}

var valeur = document.querySelectorAll('image');

for (var piou of valeur) {
    console.log(window.location.href + piou.getAttribute('xlink:href'));
}

function openInNewTab(url) {
    window.open(url, '_blank');
}
// you need to authorize your browser to open multiple tab