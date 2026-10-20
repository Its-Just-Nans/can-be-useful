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
			<h2>Vos amis</h2>
			<p><?php
							$allFriend = mesAmis($_SESSION['id']);
							if( !empty($allFriend) ){
							foreach($allFriend as $value){
								if( $value != $_SESSION['id'])
								{
									echo '<div class="amis">';
									echo "<img src='";
									$filePng='./imgUser/'.$value.'.png'; if(file_exists($filePng)){ echo $filePng; }else{ echo './imgUser/'.$value.'.jpg';}
									echo "' class='imgProfile'>";
									echo "<h4><a href='./user.php?id=".$value."'>".getUser("prenom", $value)." ".getUser("nom", $value)."</a></h4>";
									$valeur = sontAmis($_SESSION['id'], $value);
									if( $valeur['valeur'] ){
										if( $valeur['valeur'] == 1)
										{
											if( $valeur['idUser1'] == $_SESSION['id'])
											{
												echo "<div class='bouton'>";
												echo '<form method="POST" action="./ajoutAmi.php'.'?recherche='.$_GET['recherche'].'" enctype="multipart/form-data" id="ajoutAmi'.$value['id'].'">';
												echo '<input name="id1" type="text" value="'.$_SESSION['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<input name="id2" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<input name="supprDemande" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<button class="ajout boutonAmis" type="submit" form="ajoutAmi'.$value['id'].'">Demande envoyé</button>';
												echo '</form>';
												echo "</div>";
											}else{
												echo "<div class='bouton'>";
												echo '<form method="POST" action="./ajoutAmi.php'.'?recherche='.$_GET['recherche'].'" enctype="multipart/form-data" id="ajoutAmi'.$value['id'].'">';
												echo '<input name="id1" type="text" value="'.$_SESSION['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<input name="id2" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<input name="accept" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
												echo '<button class="ajout boutonAmis" type="submit" form="ajoutAmi'.$value['id'].'">Accepter l\'invitation</button>';
												echo '</form>';
												echo "</div>";
											}
										}else{
											echo "<div class='bouton'>";
											echo '<form method="POST" action="./ajoutAmi.php'.'?recherche='.$_GET['recherche'].'" enctype="multipart/form-data" id="ajoutAmi'.$value['id'].'">';
											echo '<input name="id1" type="text" value="'.$_SESSION['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
											echo '<input name="id2" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
											echo '<input name="remove" type="text" value="'.$value['id'].'" hidden form="ajoutAmi'.$value['id'].'">';
											echo '<button class="ajout boutonAmis" type="submit" form="ajoutAmi'.$value['id'].'">Amis</button>';
											echo '</form>';
											echo "</div>";
										}
									}
									echo "</div>";
									echo '<h2></h2>';
								}
							}
						}
						else{
							echo '<h3>Oh, vous n\'avez pas d\'amis.... recherchez-les !</h3>';	
						}
						?></p>
						</div>
			</article>
		</section>
	</div>
	</body>
</html>