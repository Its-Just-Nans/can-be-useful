<!DOCTYPE HTML>
<html lang="fr">
	<head>
		<meta charset="UTF-8">
		<link href="style.css" rel="stylesheet" type="text/css">
		<title>trombinouc - Inscription</title>
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
			
			<h2>Formulaire d'Inscription</h2>
			<form method="POST" action="./creation.php" enctype="multipart/form-data">
				
				<p><label for="prenom">Prénom</label><br>
					<?php if(htmlspecialchars($_GET['msg']) == 'prenom'){echo '</p><strong style="color:red">Veuillez saisir un prénom correct</strong><p>';} ?>
					<input id="prenom" name="prenom" type="text" required autofocus>
				</p>
				<p><label for="nom">Nom</label><br>
				<?php if(htmlspecialchars($_GET['msg']) == 'nom'){echo '</p><strong style="color:red">Veuillez saisir un prénom correct</strong><p>';} ?>
					<input id="nom" name="nom" type="text" required >
				</p>
				<p>Date de naissance</p>
				<p>
					<?php if(htmlspecialchars($_GET['msg']) == 'jour'){echo '</p><strong style="color:red">Veuillez saisir un jour correct</strong><p>';} ?>
					<?php if(htmlspecialchars($_GET['msg']) == 'mois'){echo '</p><strong style="color:red">Veuillez saisir un mois correct</strong><p>';} ?>
					<?php if(htmlspecialchars($_GET['msg']) == 'annee'){echo '</p><strong style="color:red">Veuillez saisir une année correct</strong><p>';} ?>
					<label for="naissanceJour">Jour</label>
						
						<input style="width:40px;" width="10px" id="naissanceJour" name="naissanceJour" type="number" required >
					<label for="naissanceMois">Mois</label>
						<input style="width:40px;" id="naissanceMois" name="naissanceMois" type="number" required >
					<label for="naissanceAnnee">Année</label>
						<input style="width:60px;" width="10px" id="naissanceAnnee" name="naissanceAnnee" type="number" required >
				</p>
				<p><label for="mail">Mail</label><br>
					<?php if(htmlspecialchars($_GET['msg']) == 'mail'){echo '</p><strong style="color:red">Veuillez saisir un mail correct</strong><p>';} ?>
					<?php if(htmlspecialchars($_GET['msg']) == 'mailused'){echo '</p><strong style="color:red">Veuillez saisir un mail non utilisé</strong><p>';} ?>
					<input id="mail" name="mail" type="email" required >
				</p>
				<p><label for="mdp1">Mot de passe</label><br>
					
					<input id="mdp1" name="mdp1" type="password" required >
				</p>
				<p><label for="mdp2">Confirmation du mot de passe</label><br>
				<?php if(htmlspecialchars($_GET['msg']) == 'mdp'){echo '</p><strong style="color:red">Veuillez saisir le même mot de passe</strong><p>';} ?>
				<?php if(htmlspecialchars($_GET['msg']) == 'errorChar'){echo '</p><strong style="color:red">Pas de \'#\' dans le mot de  passe</strong><p>';} ?>
					<input id="mdp2" name="mdp2" type="password" required >
				</p>
				<br>
				<p>
				<?php if(htmlspecialchars($_GET['img']) == 'format'){echo '</p><strong style="color:red">Erreur de format</strong><p>';} ?>
				<?php if(htmlspecialchars($_GET['img']) == 'taille'){echo '</p><strong style="color:red">Fichier trop grand</strong><p>';} ?>
				<?php if(htmlspecialchars($_GET['img']) == 'error'){echo '</p><strong style="color:red">Erreur avec l\'image</strong><p>';} ?>	
				<label for="img">Photo de profil : </label><input type="file" name="img" accept="image/png, image/jpeg, image/jpg" required>
				</p>
				<br>
				<p>
					<input id="option1" name="option1" type="checkbox" required >
					<label for="option1">J'ai pris conscience que ce site est peu sécurisé et j'accepte de partager mes informations</label>
				</p>
				<br>
				<p>
					<input id="cookie" name="cookie" type="checkbox">
					<label for="cookie">Je veux un cookie car je suis un flemmard et que j'ai pas envie d'avoir a me connecter</label>
				</p>
				<p>
					<input id="inscription" name="inscription" type="text" value="1" hidden >
				</p>
				<br>
				<p><button id="envoi" name="envoi" type="submit" value="envoi">Inscription</button></p>
			</form>
			</section>
		
	</body>
</html>