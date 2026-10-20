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
			<h2>Résultat de recherche</h2>
			<?php 	
						include_once('./FonctionSQL/rechercheFunc.php');
						$unArray = search(htmlspecialchars($_GET['recherche']));
						//print_r($unArray);
						if( !empty($unArray) ){
							foreach($unArray as $value){
								if( $value['id'] != $_SESSION['id'])
								{
									echo '<div class="amis">';
									echo "<img src='";
									$filePng='./imgUser/'.$value['id'].'.png'; if(file_exists($filePng)){ echo $filePng; }else{ echo './imgUser/'.$value['id'].'.jpg';}
									echo "' class='imgProfile'>";
									echo "<h4><a href='";
									echo "./user.php?id=".$value['id']."'>";
									echo getUser("prenom", $value['id'])." ".getUser("nom", $value['id']);
									echo "</a></h4>";
									echo "<div class='placementBouton'>";
									$valeur = sontAmis($_SESSION['id'], $value['id']);
									if( $valeur['valeur'] ){
										if( $valeur['valeur'] == 1)
										{
											if( $valeur['idUser1'] == $_SESSION['id'])
											{
												echo "<div class='bouton'>";
												echo '<form method="POST" action="./ajoutAmi.php?recherche='.$_GET['recherche'].'" enctype="multipart/form-data" id="ajoutAmi'.$value['id'].'">';
												echo '<input name="id1" type="text" value="'.$_SESSION['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<input name="id2" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<input name="supprDemande" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<button class="ajout boutonAmis" type="submit" form="ajoutAmi'.$value['id'].'">Demande envoyé</button>';
												echo '</form>';
												echo "</div>";
											}else{
												echo "<div class='bouton'>";
												echo '<form method="POST" action="./ajoutAmi.php?recherche='.$_GET['recherche'].'" enctype="multipart/form-data" id="ajoutAmi'.$value['id'].'">';
												echo '<input name="id1" type="text" value="'.$_SESSION['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<input name="id2" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<input name="accept" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<button class="ajout boutonAmis" type="submit" form="ajoutAmi'.$value['id'].'">Accepter l\'invitation</button>';
												echo '</form>';
												echo "</div>";
											}
										}else{
											echo "<div class='bouton'>";
											echo '<form method="POST" action="./ajoutAmi.php?recherche='.$_GET['recherche'].'" enctype="multipart/form-data" id="ajoutAmi'.$value['id'].'">';
											echo '<input name="id1" type="text" value="'.$_SESSION['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
											echo '<input name="id2" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
											echo '<input name="remove" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
											echo '<button class="ajout boutonAmis" type="submit" form="ajoutAmi'.$value['id'].'">Amis</button>';
											echo '</form>';
											echo "</div>";
										}
									}
									else{
										echo "<div class='bouton'>";
										echo '<form method="POST" action="./ajoutAmi.php?recherche='.$_GET['recherche'].'" enctype="multipart/form-data" id="ajoutAmi'.$value['id'].'">';
										echo '<input name="id1" type="text" value="'.$_SESSION['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
										echo '<input name="id2" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
										echo '<input name="add" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
										echo '<button class="ajout" type="submit" form="ajoutAmi'.$value['id'].'">+ Ajouter</button>';
										echo '</form>';
										echo "</div>";
									}
									
									echo "</div>";
									echo '</div>';
									echo '<h2></h2>';
								}
							}
						}
						else{
							echo '<h3>Pas de résultats</h3>';	
						}
						?>
						</div>
			</article>
		</section>
	</div>
	</body>
</html>