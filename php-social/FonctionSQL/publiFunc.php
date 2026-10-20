<?php
	
	function createPubli ($idUser, $titre, $texte, $img, $date, $valeurVisi)
	{
		
		include('connect.php');
		$sql="INSERT INTO publication (idUser,titre,texte, img, datePubli, optionVisi) VALUES ('".$idUser."','".$titre."','".$texte."','".$img."','".$date."','".$valeurVisi."')";
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
	
	function getPubliNewId ($idUser, $numero)
	{
		include('connect.php');
		$sql="SELECT idPubli FROM publication WHERE idUser = '".$idUser."' ORDER BY idPubli DESC";
		//echo $sql;
		$requete=$bd->prepare($sql);
		$requete->execute();
		$retour=$requete->fetchall();
		$requete->closeCursor();
		if (empty($retour)){
			return '';
		}else{
			return $retour[($numero)][0];
		}
	}
	
	function getIdPubliByUserId($idUser)
	{
		include('connect.php');
		$sql="SELECT idPubli  FROM publication WHERE idUser = '".$idUser."' ORDER BY idPubli DESC";
		//echo $sql;
		$requete=$bd->prepare($sql);
		$requete->execute();
		$retour=$requete->fetchall();
		$requete->closeCursor();
		if (empty($retour)){
			return '';
		}else{
			return $retour;
		}
	}
	
	function getIdPubliByUsersIds($tableauUsers)
	{
		include('connect.php');
		$sql="SELECT idPubli  FROM publication WHERE ";
		foreach($tableauUsers as $idUser){
			$sql .= " idUser = '".$idUser."' OR";
		}
		$sql .= "DER BY idPubli DESC";
		//Incroyable astuce venant de mon cerveau pour utiliser le OR pour former le mot ORDER sans utiliser de if !!! (c'est une très grande fierté)
		$requete=$bd->prepare($sql);
		$requete->execute();
		$retour=$requete->fetchall();
		$requete->closeCursor();
		if (empty($retour)){
			return '';
		}else{
			return $retour;
		}
	}
	
	function getPubliSmth ($idPubli, $variable)
	{
		include('connect.php');
		$sql="SELECT ".$variable." FROM publication WHERE idPubli = '".$idPubli."'";
		//echo $sql;
		$requete=$bd->prepare($sql);
		$requete->execute();
		$texte=$requete->fetchall();
		$requete->closeCursor();
		if (empty($texte)){
			return '';
		}else{
			return $texte[0][0];
		}
	}
	
	
	
	
	
		function supprPubli($id1){
			include_once('myRegex.php');
			$id1 = myRegexVoid($id1,'#');
			include('connect.php');
			$sql="DELETE FROM publication WHERE idUser = '".$id1."'";
			$requete=$bd->prepare($sql);
			$requete->execute();
			$resultat=$requete->fetchall();
		}
	
	
	
	
	
	
	
	
	
	
	
	//Pour les reponse
	
	function supprRep($id1){
			include_once('myRegex.php');
			$id1 = myRegexVoid($id1,'#');
			include('connect.php');
			$sql="DELETE FROM reponse WHERE idUserRep = '".$id1."'";
			$requete=$bd->prepare($sql);
			$requete->execute();
			$resultat=$requete->fetchall();
	}
	
	function getIdRepByIdPubli($idPubli)
	{
		include('connect.php');
		$sql="SELECT idRep FROM reponse WHERE idPubliRep = '".$idPubli."' ORDER BY idPubliRep DESC";
		//echo $sql;
		$requete=$bd->prepare($sql);
		$requete->execute();
		$retour=$requete->fetchall();
		$requete->closeCursor();
		if (empty($retour)){
			return false;
		}else{
			return $retour;
		}
	}
	
	
	
	function getRepSmth ($idRep, $variable)
	{
		include('connect.php');
		$sql="SELECT ".$variable." FROM reponse WHERE idRep = '".$idRep."'";
		//echo $sql;
		$requete=$bd->prepare($sql);
		$requete->execute();
		$texte=$requete->fetchall();
		$requete->closeCursor();
		if (empty($texte)){
			return false;
		}else{
			return $texte[0][0];
		}
	}
	
	
	function createRep($idUser, $idPubli, $texte, $date)
	{
		include('connect.php');
		$sql="INSERT INTO reponse (idUserRep, idPubliRep, texte, dateRep) VALUES ('".$idUser."','".$idPubli."','".$texte."','".$date."')";
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
	
	
	
	
	
	
	
	
	
	
	
?>
