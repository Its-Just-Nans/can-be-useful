<?php

require_once("./function_bdd.php");

/*
    Permet de récupérer les localisations
*/
function getLocalisation()
{
    return query("SELECT Localisation FROM `Offre_de_Stage`;");
}

function get_values($results)
{
    $final = [];
    foreach ($results as $oneResult) {
        $temp =  array_values($oneResult);
        array_push($final, $temp[0]);
    }
    return array_unique($final);
}

/*
    Permet de récupérer les compétences
*/
function getCompetences()
{
    $res = query("SELECT Competence FROM `Offre_de_Stage`;");
    return get_values($res);
}

/*
    Permet de récupérer les Entreprise
*/
function getEntreprises()
{
    $res =  query("SELECT Entreprise FROM `Offre_de_Stage`;");
    return get_values($res);
}

/*
    Permet de récupérer les DureeStage
*/
function getDureeStage()
{
    $res =  query("SELECT DureeStage FROM `Offre_de_Stage`;");
    return get_values($res);
}

/*
    Permet de récupérer les Remuneration
*/
function getRemuneration()
{
    $res = query("SELECT Remuneration FROM `Offre_de_Stage`;");
    return get_values($res);
}

function getResultSearch($params)
{
    return query("SELECT * FROM `Offre_de_Stage` WHERE
    `Competence` LIKE '%" . $params["Competence"] . "%' AND
    `Entreprise` LIKE '%" . $params["Entreprise"] . "%' AND
    `DureeStage` LIKE '%" . $params["DureeStage"] . "%' AND
    `Remuneration` LIKE '%" . $params["Remuneration"] . "%';");
}

/*
    Affiche les <option> pour les select
*/
function display_list($tableau, $champ)
{
    echo "<option value=''>"; // on laisse un champ vide par défaut
    foreach ($tableau as $value) {
        $selected = "";
        if ($value === $champ) {
            $selected = "selected";
        }
        echo "<option value='" . $value . "'" . $selected . ">" . $value . "</option>";
    }
}
