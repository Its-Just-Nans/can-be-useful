<?php

	session_start();
		if( empty($_SESSION['mail']))
		{
			header('Location:index.php?msg=nonCo');
			exit();
		}
		if(isset($_POST['photo'])){
				//changement image
				if(htmlspecialchars($_POST['photo']) == 'envoi'){
					include_once('./FonctionSQL/userFunc.php');
																				
																				
																				
					$uploadOk = 1;
					$affichage = false;
					// Check if image file is a actual image or fake image
					$check = getimagesize($_FILES["img"]["tmp_name"]);
					if($check !== false) {
					$uploadOk = 1;
					} else {
						header('Location:parametre.php?img=error');
						exit();
					}
																							
					// Check file size
					if ($_FILES["img"]["size"] > 5000000) {
					header('Location:parametre.php?img=taille');
					exit();
					}
					$target_file = "./imgUser/". basename($_FILES["img"]["name"]);
																							
					// Allow certain file formats
					$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
					if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
						header('Location:parametre.php?img=format');
						exit();
					}
					
					// Check if file already exists
					if (file_exists('./imgUser/'.$_SESSION['id'].'.jpg') OR file_exists('./imgUser/'.$_SESSION['id'].'.png') OR file_exists('./imgUser/'.$_SESSION['id'].'.jpeg'))  {
						unlink('./imgUser/'.$_SESSION['id'].'.jpg');
						unlink('./imgUser/'.$_SESSION['id'].'.jpeg');
						unlink('./imgUser/'.$_SESSION['id'].'.png');
					}
					
					if (file_exists('./imgUser/'.$_SESSION['id'].'.jpg') OR file_exists('./imgUser/'.$_SESSION['id'].'.png') OR file_exists('./imgUser/'.$_SESSION['id'].'.jpeg')) {
						$uploadOk = 0;
					}
					
					if($uploadOk == 1){
						$affichage = move_uploaded_file($_FILES["img"]["tmp_name"], $target_file);
						
					}
						$extensionFichier = $_FILES["img"]["name"][strlen($_FILES["img"]["name"])-3].$_FILES["img"]["name"][strlen($_FILES["img"]["name"])-2].$_FILES["img"]["name"][strlen($_FILES["img"]["name"])-1];
						$nomAvant = "./imgUser/".$_FILES["img"]["name"];
						$nomApres = "./imgUser/".$_SESSION['id'].'.'.$extensionFichier;
						$valeurRename = rename( $nomAvant , $nomApres);
					if($affichage && $valeurRename){
						//echo '<pre>';
						//print_r($_FILES);
						//echo '</pre>';
						header('Location:parametre.php?photo=changer');
						exit();
					}else{
						header('Location:parametre.php?photo=noUpload');
						exit();
					}
				}
		}else if(isset($_POST['Email']) && isset($_POST['mail'])){
			//changement mail
				if(htmlspecialchars($_POST['Email']) == 'envoi'){
					include_once('./FonctionSQL/userFunc.php');
					if(changeMail($_SESSION['id'], htmlspecialchars($_POST['mail']))){
						$_SESSION['mail'] = htmlspecialchars($_POST['mail']);
						header('Location:parametre.php?mail=changer');
						exit();
					}
				}else{
					header('Location:MaPage.php');
					exit();
				}

			
			
		}else if(isset($_POST['suppression']) && isset($_POST['password'])){
		//suppression de compte
			if(htmlspecialchars($_POST['suppression']) == 'envoi'){
					include_once('./FonctionSQL/userFunc.php');
					if(authen(getUser('mail', $_SESSION['id']), htmlspecialchars($_POST['password']))){
						include_once('./FonctionSQL/publiFunc.php');
						supprRep($_SESSION['id']);
						supprPubli($_SESSION['id']);
						include_once('./FonctionSQL/rechercheFunc.php');
						supprAmitie($_SESSION['id']);
						supprCompte($_SESSION['id']);
						session_destroy();
						header('Location:index.php?suppr=oui');
						exit();
						
					}else{
						header('Location:parametre.php?mdp=faux');
						exit();
					}
			}else{
				header('Location:MaPage.php');
				exit();
			}

		}else if(isset($_POST['mdp']) && isset($_POST['mdpA']) && isset($_POST['mdp1']) && isset($_POST['mdp2'])){
		//changement mdp
			if(htmlspecialchars($_POST['mdp']) == 'envoi'){
					if( htmlspecialchars($_POST['mdp1']) == htmlspecialchars($_POST['mdp2']) ) {
						include_once('./FonctionSQL/myRegex.php');
						if(regexSansHashtag(htmlspecialchars($_POST['mdp2']))){
							include_once('./FonctionSQL/userFunc.php');
							if(authen(getUser( 'mail', $_SESSION['id']), htmlspecialchars($_POST['mdpA']) )){
								if(changeMdp($_SESSION['id'], htmlspecialchars($_POST['mdp1']))){
									$cookie = getUser("optionUn", $_SESSION['id']);
									if($cookie == 1){
										include_once('./FonctionSQL/cookie.php');
										mettreCookie($_SESSION['id']);
									}
									header('Location:parametre.php?mdp=changer');
									exit();
							
								}else{
									header('Location:parametre.php?mdp=erreur');
									exit();
								}
							}else{
								header('Location:parametre.php?mdp=faux');
								exit();
							}
						}else{
							header('Location:parametre.php?mdp=errorChar');
							exit();
						}
					}else{
						header('Location:parametre.php?mdp=notSame');
						exit();
					}
			}else{
				header('Location:MaPage.php');
				exit();
			}

			
		}else{
			header('Location:MaPage.php');
			exit();
		}

?>
