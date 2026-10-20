<?php
	session_start();
		if( empty($_SESSION['mail']))
		{
			header('Location:index.php?msg=nonCo');
			exit();
		}
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
		<?php require_once('./header.php'); ?>
		
		<div id="contenu">
		<?php require_once('./info.php'); ?>
		<section id="middle">
			<article>
			<div class="interieur">
			<h2>Paramètres</h2>
			<p><?php 					echo 'Nom : '.$_SESSION['nom'];
										echo '<br>' ;
										echo 'Prenom : '.$_SESSION['prenom'];
										echo '<br>' ;
										echo 'Mail : '.$_SESSION['mail'];
										echo '<br>';
										echo "Date de naissance : ".$_SESSION['dateNaiss'];
										echo '<br>' ;
										echo 'ID : #'.$_SESSION['id'];
						?></p>
			</div>
			</article>
			<article>
				<div class="interieur">
				<h2>Changer de photo de profil</h2>
				<?php if(htmlspecialchars($_GET['photo']) == 'format'){echo '</p><strong style="color:red">Erreur de format</strong><p>';} ?>
				<?php if(htmlspecialchars($_GET['photo']) == 'taille'){echo '</p><strong style="color:red">Fichier trop grand</strong><p>';} ?>
				<?php if(htmlspecialchars($_GET['photo']) == 'error'){echo '</p><strong style="color:red">Erreur avec l\'image</strong><p>';} ?>	
				<?php if(htmlspecialchars($_GET['photo']) == 'noUpload'){echo '</p><strong style="color:red">Erreur avec l\'image</strong><p>';} ?>	
				<?php if(htmlspecialchars($_GET['photo']) == 'changer'){echo '</p><strong style="color:red">Votre photo a été mise a jour</strong><p>';} ?>	
				<form method="POST" action="./parametre2.php" enctype="multipart/form-data">
					<label for="img">Photo de profil : </label><input type="file" name="img" accept="image/png, image/jpeg, image/jpg" required>
												<br>
					<p><button id="envoi" name="photo" type="submit" value="envoi">Changer</button></p>
				</form>
				</div>
			</article>
			
			<article>
				<div class="interieur">
				<h2>Changer d'adresse Mail</h2>
				<?php
				
				if (htmlspecialchars($_GET['mail']) == "changer")
					echo "<p><strong style='color:red'>Le mail a été changé</strong></p>";
			?>
				<form method="POST" action="./parametre2.php" enctype="multipart/form-data">
					<p>
						<label for="titre">Saisissez votre nouvelle adresse mail</label><br>
						<input id="titre" name="mail" type="text" placeholder="Nouvelle adresse mail" required>
					</p>
					<br>
					<p><button id="envoi" name="Email" type="submit" value="envoi">Changer</button></p>
				</form>
				</div>
			</article>
			
			<article>
				<div class="interieur">
				<h2>Changer le mot de passe</h2>
				<?php
				
				if (htmlspecialchars($_GET['mdp']) == "notSame")
					echo "<p><strong style='color:red'>Pas le même mot de passe</strong></p>";
				if (htmlspecialchars($_GET['mdp']) == "faux")
					echo "<p><strong style='color:red'>Erreur mauvais mot de passe</strong></p>";
				if (htmlspecialchars($_GET['mdp']) == "changer")
					echo "<p><strong style='color:red'>Votre mot de passe à été changé</strong></p>";
				if (htmlspecialchars($_GET['mdp']) == "erreur")
					echo "<p><strong style='color:red'>Une erreur est survenue</strong></p>";
				if (htmlspecialchars($_GET['mdp']) == "errorChar")
					echo "<p><strong style='color:red'>Pas de '#' dans le mot de  passe</strong></p>";
				
				?>
				<form method="POST" action="./parametre2.php" enctype="multipart/form-data">
					<p>
						<label for="titre">Saisissez votre mot de passe actuel</label><br>
						<input id="titre" name="mdpA" type="password" placeholder="Mot de passe actuel" required>
					</p>
					<p>
						<label for="titre">Saisissez votre nouveau mot de passe</label><br>
						<input id="titre" name="mdp1" type="password" placeholder="Nouveau mot de passe" required>
					</p>
					<p>
						<label for="titre">Confirmer votre nouveau mot de passe</label><br>
						<input id="titre" name="mdp2" type="password" placeholder="Confirmer nouveau mdp"required>
					</p>
					
					<br>
					<p><button id="envoi" name="mdp" type="submit" value="envoi">Changer</button></p>
				</form>
				</div>
			</article>
			<article>
			<div class="interieur">
			<h2 style="color:red;">Supprimer le compte</h2>
				<?php
					
					if (htmlspecialchars($_GET['mdp']) == "faux")
						echo "<p><strong style='color:red'>Erreur Mot de passe</strong></p>";
				?>
				<form method="POST" action="./parametre2.php" enctype="multipart/form-data">
					<p>
						<label for="titre">Saisissez votre mot de passe pour supprimer votre compte</label><br>
						<input id="titre" name="password" type="password" required>
					</p>
					<br>
					<p><button id="envoi" name="suppression" type="submit" value="envoi">Supprimer</button></p>
				</form>
				</div>
			</article>
		</section>
	</div>
	</body>
</html>