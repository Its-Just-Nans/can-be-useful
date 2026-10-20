<?php
	session_start();
		
		if( (isset($_SESSION['mail'])) )
		{
			if( isset($_SESSION['id']) && isset($_SESSION['prenom']) && isset($_SESSION['dateNaiss']) )
			{
				
			}else{
				include_once('./FonctionSQL/userFunc.php');
					$_SESSION['id'] = getUserId( ($_SESSION['mail']) );
					
					include_once('./FonctionSQL/getUser.php');
					$_SESSION['nom'] = getUser("nom", $_SESSION['id']);
					$_SESSION['prenom'] = getUser("prenom", $_SESSION['id']);
					$_SESSION['dateNaiss'] = getUser("dateNaiss", $_SESSION['id']);
					$_SESSION['mail'] = getUser("mail", $_SESSION['id']);
			}
			
		}
		else
		{
					
					if( isset($_POST['login']) && isset($_POST['mdp']) )
					{
						include_once('./FonctionSQL/userFunc.php');
						if( authen(htmlspecialchars($_POST['login']), htmlspecialchars($_POST['mdp']) )  )
						{
							$_SESSION['mail'] = htmlspecialchars($_POST['login']);
							include_once('./FonctionSQL/userFunc.php');
							$_SESSION['id'] = getUserId( ($_SESSION['mail']) );
							
							include_once('./FonctionSQL/userFunc.php');
							$_SESSION['nom'] = getUser("nom", $_SESSION['id']);
							$_SESSION['prenom'] = getUser("prenom", $_SESSION['id']);
							$_SESSION['dateNaiss'] = getUser("dateNaiss", $_SESSION['id']);
						}
						else
						{
							header('Location:index.php?msg=err');
							exit();
						}
					}
					else
					{
						header('Location:index.php?msg=nonCo');
						exit();
					}
		}
	
	if( !empty($_GET) ){
		if(!empty($_GET['publi'])){
			$msgPubli = htmlspecialchars($_GET['publi']);
		}else{
			if(!empty($_GET['reponse'])){
				$msg = htmlspecialchars($_GET['reponse']);
			}
		}
	}else{
			$msg = 'rien';
	}

?>
<!DOCTYPE HTML>
<html lang="fr">
	<head>
		<meta charset="UTF-8">
		<link href="style.css" rel="stylesheet" type="text/css">
		<title>trombinouc</title>
		<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Nunito&display=swap" rel="stylesheet">
		<link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
	</head>
	<body>
		<?php require_once('./header.php'); ?>

		
		<div id="contenu">
			<?php require_once('./info.php'); ?>
			
			
			<section id="middle">
			
				<?php	
							if($msgPubli == 'ok'){echo '<article><div class="interieur"></p><strong style="color:red">Votre publication a bien été créée</strong><p></div></article>';}
							if($msgPubli == 'ko'){echo '<article><div class="interieur"></p><strong style="color:red">Erreur lors de la création de publication</strong><p></div></article>';}
							if($msg == 'ok'){echo '<article><div class="interieur"></p><strong style="color:red">Votre réponse a bien été créée</strong><p></div></article>';}
							if($msg == 'ko'){echo '<article><div class="interieur"></p><strong style="color:red">Erreur lors de la création de votre réponse</strong><p></div></article>';}
						?>
				<article>
				<div class="interieur">
					<h2>Créer une publication</h2>
							
					<form method="POST" action="./creaPubli.php">
						
						<p><label for="titre">Titre</label><br>
							<?php if($msgPubli == 'titre'){echo '</p><strong style="color:red">Veuillez saisir un prénom correct</strong><p>';} ?>
							<input id="titre" name="titre" type="text" required>
						</p>
						<p><label for="texte">Texte</label><br>
							<?php if($msgPubli == 'texte'){echo '</p><strong style="color:red">Veuillez saisir un prénom correct</strong><p>';} ?>
							
							<textarea required name="texte" style="width:400px;height:100px;max-width:700px;max-height:200px;" maxlength="1750" placeholder="Entrer le texte ici..."></textarea>
						</p>
						<p><label for="img">Img (mettez ici un lien de votre image sinon, laissez vide)</label><br>
							<?php if($msgPubli == 'nom'){echo '</p><strong style="color:red">Veuillez saisir un prénom correct</strong><p>';} ?>
							<input id="img" name="img" type="text">
						</p>
						<br>
						<p>
							<input id="creaPubli" name="creaPubli" type="text" value="1" hidden >
						</p>
						<p><button id="envoi" name="envoi" type="submit" value="envoi">Créer</button></p>
					</form>
					</div>
				</article>
				<?php
					include_once('./FonctionSQL/publiFunc.php');
					$allPubli = getIdPubliByUserId($_SESSION['id']);
					if (!empty($allPubli)){
						foreach($allPubli as $publication)
						{
								echo '<article>';
								echo '<div class="interieur">';
								echo '<h2>';
								$idDuUser = getPubliSmth($publication['idPubli'], 'idUser');
								$lienImgProfile = './imgUser/'.$idDuUser.'.png';
								if(!(file_exists($filePng))){
									$lienImgProfile = './imgUser/'.$idDuUser.'.jpg';
								}
								echo "<img class='iconImgProfile' src='".$lienImgProfile."'>";
								echo "<a href='./user.php?id=".$idDuUser."'>".getUser("prenom", $idDuUser)." ".getUser("nom", $idDuUser)."</a>";
								echo '</h2>';
								echo '<h3>';
								echo getPubliSmth($publication['idPubli'], 'titre');
								echo '</h3>';
								$isImg = getPubliSmth($publication['idPubli'], 'img');
								if( $isImg != "0" ){
									echo '<img class="imgPubli" src="'.$isImg.'">';
								}
								echo '<p>';
								echo getPubliSmth($publication['idPubli'], 'texte');
								echo '</p>';
								echo '<p class="infoPubli" ><strong>Date de la publication : '.getPubliSmth($publication['idPubli'], 'datePubli').'</strong></p>';
								echo '</div>';
								$lesRep = getIdRepByIdPubli($publication['idPubli']);
								if( !empty($lesRep)){
									foreach($lesRep as $reponse)
									{
										echo '<div class="reponse">';
										echo '<h3>';
										$idDuUser = getRepSmth($reponse['idRep'], 'idUserRep');
										$lienImgProfile = './imgUser/'.$idDuUser.'.png';
										if(!(file_exists($filePng))){
											$lienImgProfile = './imgUser/'.$idDuUser.'.jpg';
										}
										echo "<img class='iconImgProfile2' src='".$lienImgProfile."'>";
										echo "<a href='./user.php?id=".$idDuUser."'>".getUser("prenom", $idDuUser)." ".getUser("nom", $idDuUser)."</a>";
										echo '</h3>';
										echo '<p>';
										echo getRepSmth($reponse['idRep'], 'texte');
										echo '</p>';
										echo '<p class="infoRep" ><strong>Date de la publication : '.getRepSmth($reponse['idRep'], 'dateRep').'</strong></p>';
										echo '</div>';
									}
									
								}
								echo '<div class="reponse">';
									echo '<form method="POST" class="formReponse" action="./repondre.php?page=page" enctype="multipart/form-data" id="ajoutRep'.$publication['idPubli'].'">';
										echo '<input name="id1" type="text" value="'.$_SESSION['id'].'" hidden form="ajoutRep'.$publication['idPubli'].'">';
										echo '<input name="idPubli" type="text" value="'.$publication['idPubli'].'" hidden form="ajoutRep'.$publication['idPubli'].'">';
										echo '<input class="champRep" name="addRep" type="text" placeholder="Insérez votre réponse" form="ajoutRep'.$publication['idPubli'].'">';
										echo '<button class="btnReponse" type="submit" form="ajoutRep'.$publication['idPubli'].'">Repondre</button>';
									echo '</form>';
								echo '</div>';
								echo '</article>';
						}
					}
				?>
			</section>
		</div>
	</body>
</html>
