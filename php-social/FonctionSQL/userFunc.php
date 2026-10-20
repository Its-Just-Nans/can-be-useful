<?php
//fichier contenant les fonctions concerant le user
	
	function createUser ($prenom, $nom, $dateNaiss, $email, $mdp, $option1)
	{
		include_once('myRegex.php');
		$prenom = myRegexVoid($prenom,'#');
		$nom = myRegexVoid($nom,'#');
		$dateNaiss = myRegexVoid($dateNaiss,'#');
		$email = myRegexVoid($email,'#');
		$mdp = myRegexVoid($mdp,'#');
		$option1 = myRegexVoid($option1,'#');
		include('connect.php');
		$sql="INSERT INTO utilisateur (prenom,nom,dateNaiss,mail,mdp,optionUn) VALUES ('".$prenom."','".$nom."','".$dateNaiss."','".$email."','".$mdp."','".$option1."')";
		//echo $sql;
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		
		if( empty($resultat) )
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	
	function changeMail($id1, $newMail){
		include_once('myRegex.php');
		$id1 = myRegexVoid($id1,'#');
		$newMail = myRegexVoid($newMail,'#');
		include('connect.php');
		$sql="UPDATE amitie SET mail='".$newMail."' WHERE id = '".$id1."'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		return true;
	}
	
	
	function changeMdp($id1, $newPass){
		include_once('myRegex.php');
		$id1 = myRegexVoid($id1,'#');
		$newMdp = password_hash($newPass, PASSWORD_DEFAULT);
		include('connect.php');
		$sql="UPDATE utilisateur SET mdp='".$newMdp."' WHERE id = '".$id1."'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		return true;
	}
	
	function supprCompte($id1){
		include_once('myRegex.php');
		$id1 = myRegexVoid($id1,'#');
		include('connect.php');
		$sql="DELETE FROM utilisateur WHERE id = '".$id1."'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();		
	}
	

	
	function getUser ($nomVar, $idUser)
	{
		include('connect.php');
		$sql="SELECT ".$nomVar." FROM utilisateur WHERE id = '".$idUser."'";
		//echo $sql;
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		return $resultat[0][0];
	}
	
	
	function getUserDateSmth ($nomVar, $idUser)
	{
		include('connect.php');
		$sql="SELECT dateNaiss FROM utilisateur WHERE id = '".$idUser."'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		$partie = explode("-", $resultat[0][0]);
		if($nomVar == "jour"){
			return $partie[2];
		}
		else if($nomVar == "mois"){
			return $partie[1];
		}else{
			return $partie[0];
		}
	}
	
	
	function getUserId ($mail)
	{
		include('connect.php');
		$sql="SELECT id FROM utilisateur WHERE mail = '".$mail."'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		return $resultat[0][0];
	}
	
	function authen ($addresseMail, $password){
		include('connect.php');
		$sql="SELECT mdp FROM utilisateur WHERE mail = '".$addresseMail."'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		if( isset($resultat) && password_verify($password, $resultat[0]['mdp']))
		{
			return true;
		}
		else if ( empty($resultat) )
		{
			return false;
		}
		else
		{
			return false;
		}
	}
	
	
	
	function mailUtilise ($addresseMail){
		include('connect.php');
		$sql="SELECT mail FROM utilisateur WHERE mail = '".$addresseMail."'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		
		if( isset($resultat) && $resultat[0][0] == $addresseMail )
		{
			return true;
		}
		else if ( empty($resultat) )
		{
			return false;
		}
		else
		{
			return false;
		}
	}
?>
