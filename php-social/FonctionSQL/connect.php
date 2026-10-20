
<?php
	//commande de connection
	try
	{
		$bd = new PDO("mysql:host=localhost;dbname=trombinouc","nans","dbnans");
		$bd->exec('SET NAMES utf8');
	}
	catch (Exception $e){
		die("Erreur: Connextion impossible");
	}


?>
