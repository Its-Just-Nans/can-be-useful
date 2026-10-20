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
					include_once('./FonctionSQL/publiFunc.php');
					$allFriend = mesAmis($_SESSION['id']);
					array_push($allFriend, $_SESSION['id']);
					$allPubli = getIdPubliByUsersIds($allFriend);
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
									echo '<form method="POST" class="formReponse" action="./repondre.php?page=mur" enctype="multipart/form-data" id="ajoutRep'.$publication['idPubli'].'">';
										echo '<input name="id1" type="text" value="'.$_SESSION['id'].'" hidden form="ajoutRep'.$publication['idPubli'].'">';
										echo '<input name="idPubli" type="text" value="'.$publication['idPubli'].'" hidden form="ajoutRep'.$publication['idPubli'].'">';
										echo '<input class="champRep" name="addRep" type="text" placeholder="Insérez votre réponse" form="ajoutRep'.$publication['idPubli'].'">';
										echo '<button class="btnReponse" type="submit" form="ajoutRep'.$publication['idPubli'].'">Repondre</button>';
									echo '</form>';
								echo '</div>';
								echo '</article>';
					}
				?>
			</section>
		</div>
	</body>
</html>