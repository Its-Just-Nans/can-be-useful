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
			<h2>Vos Photos</h2>
			<?php
						include_once('./FonctionSQL/publiFunc.php');
						echo '<h3>Photo de profil :</h3>';
						$lienImgProfile = './imgUser/'.$_SESSION['id'].'.png';
								if(!(file_exists($filePng))){
									$lienImgProfile = './imgUser/'.$_SESSION['id'].'.jpg';
								}
								echo "<img class='photo' src='".$lienImgProfile."'>";
								echo '<h2></h2>';
						echo '<h3>Autres photos :</h3>';
						
						$allPubli = getIdPubliByUserId($_SESSION['id']);
						if (!empty($allPubli)){
							foreach($allPubli as $publication)
							{
								$isImg = getPubliSmth($publication['idPubli'], 'img');
								if( $isImg != "0" ){
									echo '<img class="photo" src="'.$isImg.'">';
									echo '<h2></h2>';
								}
								
							}
						}
				?>
				</div>
			</article>
		</section>
	</div>
	</body>
</html>