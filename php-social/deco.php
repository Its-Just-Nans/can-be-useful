<?php
		session_start();
		include_once('./FonctionSQL/userFunc.php');
		$cookie = getUser("optionUn", $_SESSION['id']);
		if($cookie == 1){
			include_once('./FonctionSQL/cookie.php');
			$cookieMit = mettreCookie($_SESSION['id']);
		}
		session_destroy();
		
?>
<!DOCTYPE HTML>
<html lang="fr">
	<head>
		<meta charset="UTF-8">
		<link href="style.css" rel="stylesheet" type="text/css">
		<title>trombinouc - Acceuil</title>
		<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Nunito&display=swap" rel="stylesheet">
		<link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
	</head>
	<body>
		<header>
			<div id="titleFront">
				<h1 class="titleBase"><a href="./index.php" class="titleBase">trombinouc</a></h1>
				
			</div>
		</header>
		
		<div id="contenu">
		<section id="profil">
			<h2>Vous avez correctement déconnecté</h2>
			<h3><a href='index.php' >Lien vers l'accueil</a></h3>
			<?php
				if(isset($cookieMit) && $cookieMit == true){
					echo '<p>Votre cookie a été actualisé ;)</p>';
				}
			?>
			<strong>Si vous avez mis un compte avec un Cookie et que vous voulez changer de compte, veuillez supprimer vos cookie</strong>
		</section>
		
	</body>
</html>
