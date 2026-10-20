<?php

		session_start();
		if( isset($_POST['id1']) && isset($_POST['id2']) && isset($_SESSION['id']))
		{
			include_once('./FonctionSQL/rechercheFunc.php');
			if(isset($_POST['add'])){
				add(htmlspecialchars($_POST['add']), htmlspecialchars($_SESSION['id']));
			}else if (isset($_POST['remove'])){
				remove(htmlspecialchars($_POST['remove']), htmlspecialchars($_SESSION['id']));
			}else if (isset($_POST['accept'])){
				accept(htmlspecialchars($_POST['accept']), htmlspecialchars($_SESSION['id']));
			}else if (isset($_POST['supprDemande'])){
				supprDemande(htmlspecialchars($_POST['supprDemande']), htmlspecialchars($_SESSION['id']));
			}
			if(isset($_GET['ami'])){
				header('Location:amis.php');
				exit();
			}else{
				header('Location:recherche.php'.'?recherche='.$_GET['recherche']);
				exit();
			}
			
		}
		else{
			header('Location:index.php?msg=nonCo');
			exit();
		}

?>
