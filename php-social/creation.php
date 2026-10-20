<?php


			if( isset($_POST['inscription']) && htmlspecialchars($_POST['inscription']) == '1')
			{

				if( isset($_POST['prenom']) && ctype_alpha(htmlspecialchars($_POST['prenom'])) && strlen(htmlspecialchars($_POST['prenom'])) < 255 )
				{
					$prenom = htmlspecialchars($_POST['prenom']);
					if( isset($_POST['nom']) && ctype_alpha(htmlspecialchars($_POST['nom'])) && strlen(htmlspecialchars($_POST['nom'])) < 255 )
					{
						$nom = htmlspecialchars($_POST['nom']);
						include_once('./FonctionSQL/myRegex.php');
						if( isset($_POST['naissanceJour']) && htmlspecialchars($_POST['naissanceJour']) && htmlspecialchars($_POST['naissanceJour']) >= 1 && htmlspecialchars($_POST['naissanceJour']) <=31)
						{
							if( isset($_POST['naissanceMois']) && htmlspecialchars($_POST['naissanceMois']) && htmlspecialchars($_POST['naissanceMois']) >= 1 && htmlspecialchars($_POST['naissanceMois']) <= 12 )
							{
								if( isset($_POST['naissanceAnnee']) && htmlspecialchars($_POST['naissanceAnnee']) && htmlspecialchars($_POST['naissanceAnnee']) < 2010 && htmlspecialchars($_POST['naissanceAnnee']) > 1900)
								{	
													include_once('./FonctionSQL/userFunc.php');
													
													if( mailUtilise( htmlspecialchars($_POST['mail']) ) )
													{
														header('Location:inscription.php?msg=mailused');
														exit();
													}
													else
													{
														
														if( htmlspecialchars($_POST['mdp1']) == htmlspecialchars($_POST['mdp2']))
														{
															if(regexSansHashtag(htmlspecialchars($_POST['mdp2'])))
															{
																if(htmlspecialchars($_POST['option1']) == "on")
																{
																		if(htmlspecialchars($_POST['cookie']) == "on")
																		{
																			$valeurOption1=1;
																		}else{
																			$valeurOption1=0;
																		}
																			
																			
																			include_once('./FonctionSQL/userFunc.php');
																			
																			
																			
																				$uploadOk = 1;
																				$affichage = false;
																				// Check if image file is a actual image or fake image
																				$check = getimagesize($_FILES["img"]["tmp_name"]);
																				if($check !== false) {
																					$uploadOk = 1;
																				} else {
																					header('Location:inscription.php?img=error');
																					exit();
																				}
																				
																				// Check file size
																				if ($_FILES["img"]["size"] > 5000000) {
																					header('Location:inscription.php?img=taille');
																					exit();
																				}
																				$target_file = "./imgUser/". basename($_FILES["img"]["name"]);
																				
																				// Allow certain file formats
																				$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
																				if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
																					header('Location:inscription.php?img=format');
																					exit();
																				}
																				
																				
																				
																				
																			
																			if($uploadOk == 1){
																				$mdp = password_hash(htmlspecialchars($_POST['mdp1']), PASSWORD_DEFAULT);
																				$dateNaiss = htmlspecialchars($_POST['naissanceAnnee'])."-".htmlspecialchars($_POST['naissanceMois'])."-".htmlspecialchars($_POST['naissanceJour']);
																				$final = createUser($prenom, $nom, $dateNaiss, htmlspecialchars($_POST['mail']), $mdp, $valeurOption1);
																				if( $valeurOption1 == 1){	
																					include_once('./FonctionSQL/cookie.php');
																					$cookie = mettreCookie(getUserId(htmlspecialchars($_POST['mail'])));
																				}
																				if($final){
																					$affichage = move_uploaded_file($_FILES["img"]["tmp_name"], $target_file);
																					include_once('./FonctionSQL/userFunc.php');
																					$extensionFichier = $_FILES["img"]["name"][strlen($_FILES["img"]["name"])-3].$_FILES["img"]["name"][strlen($_FILES["img"]["name"])-2].$_FILES["img"]["name"][strlen($_FILES["img"]["name"])-1];
																					$nomAvant = "./imgUser/".$_FILES["img"]["name"];
																					$nomApres = "./imgUser/".getUserId(htmlspecialchars($_POST['mail'])).'.'.$extensionFichier;
																					rename($nomAvant , $nomApres);
																				}
																			}else{
																				header('Location:inscription.php?img=error');
																				exit();
																			}
																	}	
																}else{
																	header('Location:inscription.php?msg=errorChar');
																	exit();
																}

														}
														else{
															header('Location:inscription.php?msg=mdp');
															exit();
														}
													}
								}else{header('Location:inscription.php?msg=annee');exit();}
							}else{header('Location:inscription.php?msg=mois');exit();}
						}else{header('Location:inscription.php?msg=jour');exit();}
					}else{header('Location:inscription.php?msg=nom');exit();}
				}else{header('Location:inscription.php?msg=prenom');exit();}
			}
			else
			{
				header('Location:index.php');
				exit();
			}
?>
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

<!-- Début du HTML généré par PHP -->			

<!-- Fin du HTML généré par PHP -->			
		<div id="contenu">
		<section id="profil">
			
			<h2>Formulaire d'Inscription</h2>
			<?php 
					if($final == true){
						echo '<p>Vous avez bien été inscrit</p>';
					}else{
						echo '<p>Erreur, veuillez recommencer</p>';
					}
					if($cookie){
						echo '<p>Votre cookie a été mis en place :)</p>';
					}
					?>
			<h3><a href='index.php' >Lien vers trombinouc</a></h3>
			</section>
		</div>
	</body>
</html>