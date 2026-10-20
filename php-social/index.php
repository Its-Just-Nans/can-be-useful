<?php
	session_start();
	if( isset($_COOKIE['connection']) )
	{
		
			include_once('./FonctionSQL/cookie.php');
			$acces = checkerCookie($_COOKIE['connection']);
			
			if($acces == true){
				include_once('./FonctionSQL/userFunc.php');
				$id = explode('$', $_COOKIE['connection']);
				$_SESSION['mail'] = getUser("mail", $id[0]);
				header('Location:MaPage.php');
				exit();
			}
	}

?>


<!DOCTYPE HTML>
<html lang="fr">
	<head>
		<meta charset="UTF-8">
		<link href="style.css" rel="stylesheet" type="text/css">
		<title>trombinouc - Accueil</title>
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
			
			<h2>Formulaire de Connexion</h2>
			<?php
				
				if (htmlspecialchars($_GET['msg']) == "err")
					echo "<p><strong style='color:red'>Login ou mot de passe incorrect. Veuillez recommencer</strong></p>";
				if (htmlspecialchars($_GET['msg']) == "nonCo")
					echo "<p><strong style='color:red'>Veuillez vous connecter</strong></p>";
				if (htmlspecialchars($_GET['suppr']) == "oui")
					echo "<p><strong style='color:red'>Votre compte a bien été supprimé</strong></p>";
			?>
			<form method="POST" action="./MaPage.php">
				<p><label for="login">Login (mail)</label><br>
					<input id="login" name="login" type="text" required autofocus>
				</p>
				<p><label for="mdp">Mot de passe</label><br>
					<input id="mdp" name="mdp" type="password" required >
				</p><br>
				<p><button id="envoi" name="envoi" type="submit" value="envoi">Connnexion</button></p>
			</form>
			
			<p>Vous n'avez pas de compte ? <a href="inscription.php">Inscrivez-vous</a></p>
			<strong>Si vous avez mis un compte avec un Cookie et que vous voulez changer de compte, veuillez supprimer vos cookies</strong>
			</section>
		
	</body>
</html>