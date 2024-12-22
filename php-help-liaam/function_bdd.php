<?php

// TODO mettre dans un fichier .env pour la sécurité
$_ENV["DB_HOST"] = "localhost";
$_ENV["DB_NAME"] = "wtyf1";
$_ENV["DB_USER"] = "toto";
$_ENV["DB_PASS"] = "password";

function createConnection()
{
	try {
		$bd = new PDO("mysql:host=" . $_ENV["DB_HOST"] . ";dbname=" . $_ENV["DB_NAME"], $_ENV["DB_USER"], $_ENV["DB_PASS"]);
		$bd->exec('SET NAMES utf8');
	} catch (Exception $e) {
		echo $e;
		die("Erreur: Connexion impossible\n");
	}
	return $bd;
};


function query($sql)
{
	try {
		$bd = createConnection();
		$bd->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); // don't transform fields into strings
		$request = $bd->prepare($sql);
		$request->execute();
		$results = $request->fetchall(PDO::FETCH_ASSOC); // don't return numbered index, only name of column
		$request->closeCursor();
	} catch (Exception $e) {
		$results = [];
	}
	return $results;
};
