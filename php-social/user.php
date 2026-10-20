<?php
	session_start();
		if( empty($_SESSION['mail'])){
			header('Location:index.php?msg=nonCo');
			exit();
		}
		$idFriend = htmlspecialchars($_GET['id']);
		if(!ctype_digit($idFriend)){
			header('Location:MaPage.php');
			exit();
		}
		if($idFriend == $_SESSION['id']){
			header('Location:MaPage.php');
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
		<section id="info">
				<div class="informations">
					<h3><a href="./MaPage.php">Retour à votre page</a></h3>
				</div>
				<div class="informations">
					<img id="imgProfile" src="<?php $filePng='./imgUser/'.$idFriend.'.png'; if(file_exists($filePng)){ echo $filePng; }else{ echo './imgUser/'.$idFriend.'.jpg';} ?>" >
					<?php
					include_once('./FonctionSQL/userFunc.php');
					echo '<h3>';
					echo getUser("prenom", $idFriend);
					echo ' ';
					echo getUser("nom", $idFriend);
					echo '</h3>';
					include_once('./FonctionSQL/rechercheFunc.php');
					include_once('./FonctionSQL/userFunc.php');
					if( sontAmis($idFriend, $_SESSION['id']) ){
						echo '<p>Son adresse mail est : <a href="https://pic.sopili.net/lnk/-/email-html/show/?text='.getUser('mail',$idFriend).'">'.getUser('mail',$idFriend).'</a></p>';
					}
					echo '</div>';
					
					if( (getUserDateSmth("mois", $idFriend) == date("m")) && (getUserDateSmth("jour", $idFriend) == date("d")) )
					{
						echo '<div class="informations">';
						echo "<h3 style='color:red;'>C'est son anniversaire !</h3>";
						echo '</div>';
					}

					
					
					?>
				
			</section>	
			<section id="middle">
				<?php
					include_once('./FonctionSQL/rechercheFunc.php');
					if( sontAmis($idFriend, $_SESSION['id']) ){
						
						include_once('./FonctionSQL/publiFunc.php');
						$allPubli = getIdPubliByUserId($idFriend);
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
									echo '<form method="POST" class="formReponse" action="./repondre.php?page=user&id='.$idDuUser.'" enctype="multipart/form-data" id="ajoutRep'.$publication['idPubli'].'">';
										echo '<input name="id1" type="text" value="'.$_SESSION['id'].'" hidden form="ajoutRep'.$publication['idPubli'].'">';
										echo '<input name="idPubli" type="text" value="'.$publication['idPubli'].'" hidden form="ajoutRep'.$publication['idPubli'].'">';
										echo '<input class="champRep" name="addRep" type="text" placeholder="Insérez votre réponse" form="ajoutRep'.$publication['idPubli'].'">';
										echo '<button class="btnReponse" type="submit" form="ajoutRep'.$publication['idPubli'].'">Repondre</button>';
									echo '</form>';
								echo '</div>';
								echo '</article>';
						}
					}else{
								echo '<article>';
								echo '<div class="interieur">';
								echo '<h2>Vous n\'êtes pas amis</h2>';
								echo '</div>';
								echo '</article>';
						
					}
				?>
			</section>
		</div>
	</body>
</html>