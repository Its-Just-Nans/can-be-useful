#!/bin/sh

functionITERATOR() {
    lienBase=$1
    nbLignePDF=$(wc -l <tmpPDF)
    if [ "$nbLignePDF" != "0" ]; then
        for i in $(seq 1 "$nbLignePDF"); do
            number=$i
            reste=$(($nbLignePDF - $i + 1))
            echo "Il y a $nbLignePDF fichier PDF et il en reste $reste"
            fichierPDF=$(sed -e "s:^.*/\(.*\).pdf$:\1:g" tmpPDF | sed -n "$number"p)
            mkdir "PDF-$fichierPDF"
            linkToPDF=$(sed -e 's:^/\(.*\)$:\1:g' tmpPDF | sed -n "$number"p)
            cd ./"PDF-$fichierPDF" || exit
            echo "$linkToPDF"
            lienFichierPDF="$lienBase$linkToPDF"
            echo "$lienFichierPDF"
            echo ""
            echo "================Wget================"
            wget -P ./ "$lienFichierPDF"
            echo "==============End-Wget=============="
            echo ""
            cd .. || exit
        done
    else
        echo "Pas de fichier PDF"
    fi
    nbLigneHTML=$(wc -l <tmpHTML)
    if [ "$nbLigneHTML" != "0" ]; then
        for z in $(seq 1 "$nbLigneHTML"); do
            number=$z
            reste=$(($nbLigneHTML - $z + 1))
            echo "Il y a $nbLigneHTML lien HTML et il en reste $reste"
            fichierHTML=$(sed -n "$number"p tmpHTML-Title)
            mkdir "HTML-$fichierHTML"
            linkToHTML=$(sed -e 's:^/\(.*\)$:\1:g' tmpHTML | sed -n "$number"p)
            cd ./"HTML-$fichierHTML" || exit
            echo "$linkToHTML"
            lienFichierHTML="$lienBase$linkToHTML"
            echo "$lienFichierHTML"
            echo ""
            echo "================Wget================"
            wget -P ./ "$lienFichierHTML"
            echo "==============End-Wget=============="
            echo ""
            cd .. || exit
        done
    else
        echo "Pas de fichier HTML"
    fi
}

functionSAID() {
    mkdir Site
    cd ./Site || exit
    echo "Le lien est $1"
    nomDossier=$(echo "$1" | sed -e 's:^.*/\(.*\).html\?$:\1:g')
    lienBase=$(echo "$1" | sed -e 's:^\(.*\)/.*.html\?$:\1/:g')
    echo "Le lien de base est $lienBase"
    echo "Le nom de dossier est $nomDossier"
    mkdir "$nomDossier"
    cd ./"$nomDossier" || exit
    echo ""
    echo "================Wget================"
    wget -P ./ "$1"
    echo "==============End-Wget=============="
    echo ""
    grep '^.*href=".*.html\?".*$' "$nomDossier".html | sed -e 's:^.*href="\(.*.html\?\)".*$:\1:g' >tmpHTML
    grep '^.*href=".*.html".*$' "$nomDossier".html | sed -e 's:^.*html\?">\(.*\)</a>.*$:\1:g' >tmpHTML-Title
    grep '^.*href=".*\.pdf".*$' "$nomDossier".html | sed -e 's:^.*href="\(.*.pdf\)".*$:\1:g' >tmpPDF
    functionITERATOR "$lienBase"
    functionSUITE "$1" "$nbLigneHTML"
}

functionSUITE() {
    for o in $(seq 1 "$2"); do
        echo ""
        echo '<----------------------NewFile---------------------->'
        echo ""
        numberFOR=$o
        nomDossier=$(sed -n "$numberFOR"p tmpHTML-Title)
        complementLien=$(sed -e 's:^\(.*\)index.html\?:\1:g' tmpHTML | sed -n "$numberFOR"p)
        lienBasePre=$(echo "$1" | sed -e 's:^\(.*\)/.*.html\?$:\1/:g')
        echo "Le lien de base est $lienBase"
        lienBase="$lienBasePre$complementLien"
        echo "Le lien de base est $lienBase"
        echo "Le nom de dossier est $nomDossier"
        cd ./"HTML-$nomDossier" || exit
        grep '^.*href=".*.html\?".*$' index.html | sed -e 's:^.*href="\(.*.html\?\)".*$:\1:g' >tmpHTML
        grep '^.*href=".*.html\?".*$' index.html | sed -e 's:^.*html\?">\(.*\)</a>.*$:\1:g' >tmpHTML-Title
        grep '^.*href=".*\.pdf".*$' index.html | sed -e 's:^.*href="\(.*.pdf\)".*$:\1:g' >tmpPDF
        functionITERATOR "$lienBase"
        cd .. || exit
    done
}

echo 'Quel site voulez-vous télécharger ?'
read -r REPLY
testSite=$(echo "$REPLY" | sed -e 's:^.*.html\?$:index\nindex:g' | wc -l)
while [ "$REPLY" = "" ] || [ "$testSite" != "2" ]; do
    echo "Veuillez re-saisir le lien"
    read -r REPLY
    testSite=$(echo "$REPLY" | sed -e 's:^.*.html\?$:index\nindex:g' | wc -l)
done
site=$REPLY

echo ""
echo 'Voulez vous vraiment télécharger le site :'
echo "$site"
echo ""
echo 'Continue?[Yes/No]'
read -r reply2
if [ "$reply2" = "y" ] || [ "$reply2" = "yes" ] || [ "$reply2" = "Y" ] || [ "$reply2" = "Yes" ] || [ "$reply2" = "YES" ]; then
    echo "Let's go"
    functionSAID "$site"
elif [ "$reply2" = "n" ] || [ "$reply2" = "no" ] || [ "$reply2" = "N" ] || [ "$reply2" = "No" ] || [ "$reply2" = "NO" ]; then
    echo 'Program Stop'
else
    echo 'Error'
fi
