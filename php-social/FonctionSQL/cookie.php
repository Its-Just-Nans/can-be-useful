<?php
// fichier de fonction pour les cookie
	function mettreCookie($id){
		include_once('myRegex.php');
		$id = myRegexVoid($id,'#');
		include('connect.php');
		$sql="SELECT mdp, mail FROM utilisateur WHERE id = '".$id."'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		if( !empty($resultat)){
			$mdp=$resultat[0]['mdp'];
			$mail=$resultat[0]['mail'];
			$grosHash = password_hash($mail.$mdp, PASSWORD_DEFAULT);
			setcookie("connection", $id.$grosHash, time()+7*24*3600);
			return true;
		}else{
			return false;
		}
		
	}
	
	function checkerCookie($cookie){
		$id = explode('$',$cookie);
		include_once('myRegex.php');
		$id = myRegexVoid($id,'#');
		include('connect.php');
		$sql="SELECT mdp, mail FROM utilisateur WHERE id = '".$id[0]."'";
		$requete=$bd->prepare($sql);
		$requete->execute();
		$resultat=$requete->fetchall();
		$requete->closeCursor();
		
		if( !empty($resultat)){
			$mdp=$resultat[0]['mdp'];
			$mail=$resultat[0]['mail'];
			$result = password_verify($mail.$mdp, substr($cookie, strlen($id[0])));
			return $result;
		}else{
			return false;
		}
	}
	
?>
