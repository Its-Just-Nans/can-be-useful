
<?php
	/*commande faites une seule fois */
	include('./connect.php');
	$sql="CREATE TABLE utilisateur ( id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, prenom VARCHAR(255) NOT NULL, nom VARCHAR(255) NOT NULL, dateNaiss DATE NOT NULL, mail VARCHAR(255) NOT NULL, mdp VARCHAR(255) NOT NULL, optionUn INT DEFAULT 0, optionDeux INT DEFAULT 0)";
	$requete=$bd->prepare($sql);
	$requete->execute();
	$results=$requete->fetchall();
	$requete->closeCursor();
	
	include('./connect.php');
	$sql="CREATE TABLE publication ( idPubli INT PRIMARY KEY NOT NULL AUTO_INCREMENT, idUser INT NOT NULL , titre VARCHAR(255) NOT NULL, texte VARCHAR(1000) NOT NULL, img VARCHAR(400) NOT NULL, datePubli DATETIME NOT NULL, optionVisi INT DEFAULT 0, CONSTRAINT idUser FOREIGN KEY (idUser) REFERENCES utilisateur(id) )";
	$requete=$bd->prepare($sql);
	$requete->execute();
	$results=$requete->fetchall();
	$requete->closeCursor();
	
	include('./connect.php');
	$sql="CREATE TABLE amitie ( idAmitie INT PRIMARY KEY NOT NULL AUTO_INCREMENT, idUser1 INT NOT NULL , idUser2 INT NOT NULL, valeur INT NOT NULL, CONSTRAINT idUser1 FOREIGN KEY (idUser1) REFERENCES utilisateur(id), CONSTRAINT idUser2 FOREIGN KEY (idUser2) REFERENCES utilisateur(id) )";
	$requete=$bd->prepare($sql);
	$requete->execute();
	$results=$requete->fetchall();
	$requete->closeCursor();
	
	include('./connect.php');
	$sql="CREATE TABLE reponse ( idRep INT PRIMARY KEY NOT NULL AUTO_INCREMENT, idUserRep INT NOT NULL, idPubliRep INT NOT NULL, texte VARCHAR(255) NOT NULL, dateRep DATETIME NOT NULL, optionVisi INT DEFAULT 0, CONSTRAINT idUserRep FOREIGN KEY (idUserRep) REFERENCES utilisateur(id), CONSTRAINT idPubliRep FOREIGN KEY (idPubliRep) REFERENCES publication(idPubli) )";
	$requete=$bd->prepare($sql);
	$requete->execute();
	$results=$requete->fetchall();
	$requete->closeCursor();
	
	//Oui, on aurait pu ouvrir la connection qu'une seule fois et faire toutes les requetes mais je ne suis pas de genre là :)
	//Oui, la variable résultat ne sert a rien mais elle ma servit par le passé et j'ai désormais beaucoup d'affection pour cette varible si utile, je ne veux donc pas la supprimer (je suis un développeur émotif)
	// Plus sérieusement, cela montre que j'ai fait des tests, etc....
	
?>
