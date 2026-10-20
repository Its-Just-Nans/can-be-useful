<?php
	function search($string){
		include_once('myRegex.php');
		$string = myRegexVoid($string,'#');
		include('connect.php');
		$sql="SELECT id FROM utilisateur WHERE nom = '".$string."' OR prenom = '".$string."'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		return $resultat;
	}
	
	function sontAmis($id1, $id2){
		include_once('myRegex.php');
		$id1 = myRegexVoid($id1,'#');
		$id2 = myRegexVoid($id2,'#');
		include('connect.php');
		$sql="SELECT valeur, idUser1 FROM amitie WHERE (idUser1 = '".$id1."' AND idUser2 = '".$id2."') OR (idUser1 = '".$id2."' AND idUser2 = '".$id1."')";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		if( !empty($resultat[0]) ) {
			
			return $resultat[0];
		}
	}
	
	function mesAmis($id1){
		include_once('myRegex.php');
		$id1 = myRegexVoid($id1,'#');
		include('connect.php');
		$sql="SELECT idUser1,idUser2 FROM amitie WHERE (idUser1 = '".$id1."' OR idUser2 = '".$id1."') AND valeur = '2'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		$mesAmisEnTableau=array();
		foreach($resultat as $valeur){
			if($valeur['idUser1'] == $id1){
					array_push($mesAmisEnTableau, $valeur['idUser2']);
			}else{
				array_push($mesAmisEnTableau, $valeur['idUser1']);
			}
			
		}
		return $mesAmisEnTableau;
	}
	
	
	function annivAmis($id){
		include_once('myRegex.php');
		$id = myRegexVoid($id,'#');
		include('connect.php');
		$sql="SELECT DISTINCT amitie.idUser1, amitie.idUser2, utilisateur.dateNaiss FROM utilisateur INNER JOIN amitie ON amitie.idUser1 = utilisateur.id OR amitie.idUser2 = utilisateur.id WHERE amitie.valeur = 2 AND utilisateur.id = '".$id."'";
		//echo $sql;
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		$mesAmisEnTableau=array();
		if(!empty($resultat)){
				return $resultat;
		}
		return false;
	}
	
	function add($id1, $id2){
		include_once('myRegex.php');
		$id1 = myRegexVoid($id1,'#');
		$id2 = myRegexVoid($id2,'#');
		include('connect.php');
		$sql="INSERT INTO amitie (idUser1,idUser2,valeur) VALUES ('".$id2."','".$id1."','".'1'."')";
		//echo $sql;
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
	}
	
	function accept($id1, $id2){
		include_once('myRegex.php');
		$id1 = myRegexVoid($id1,'#');
		$id2 = myRegexVoid($id2,'#');
		include('connect.php');
		$sql="UPDATE amitie SET valeur='2' WHERE idUser1 = '".$id1."' AND idUser2 = '".$id2."'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
	}
	
	function remove($id1, $id2){
		include_once('myRegex.php');
		$id1 = myRegexVoid($id1,'#');
		$id2 = myRegexVoid($id2,'#');
		include('connect.php');
		$sql="DELETE FROM amitie WHERE (idUser1 = '".$id1."' AND idUser2 = '".$id2."') OR (idUser1 = '".$id2."' AND idUser2 = '".$id1."')";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
	}
	
	function supprDemande($id1, $id2){
		include_once('myRegex.php');
		$id1 = myRegexVoid($id1,'#');
		$id2 = myRegexVoid($id2,'#');
		include('connect.php');
		$sql="DELETE FROM amitie WHERE idUser1 = '".$id2."' AND idUser2 = '".$id1."'";
		//echo $sql;
		$requete=$bd->prepare($sql);	
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
	}
	
	function demandeEnCours($id, $typeDemande){
		include_once('myRegex.php');
		$id = myRegexVoid($id,'#');
		include('connect.php');	
		if( $typeDemande == 'demandeEnv'){
			$sql="SELECT idUser2 FROM amitie WHERE idUser1 = '".$id."' AND valeur = '1'";
		}else{
			$sql="SELECT idUser1 FROM amitie WHERE idUser2 = '".$id."' AND valeur = '1'";
		}
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		return $resultat;
	}
	
		function supprAmitie($id1){
			include_once('myRegex.php');
			$id1 = myRegexVoid($id1,'#');
			include('connect.php');
			$sql="DELETE FROM amitie WHERE idUser1 = '".$id1."' OR idUser2 = '".$id1."'";
			$requete=$bd->prepare($sql);
			$requete->execute();
			$resultat=$requete->fetchall();
		}
?>
