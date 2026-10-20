<?php
	session_start();
			if( isset($_POST['creaPubli']) && htmlspecialchars($_POST['creaPubli']) == '1')
			{
				if( isset($_POST['titre']) )
				{
					include_once('./FonctionSQL/myRegex.php');
					$titre = regexApos(htmlspecialchars($_POST['titre']));
					if( isset($_POST['texte']) )
					{
						$texte = regexApos(htmlspecialchars($_POST['texte']));

									$valeurVisi = 1;
								if( empty($_POST['img']) )
								{
										$img = 0;
								}
								else{
									$img = htmlspecialchars($_POST['img']);
								}
								$laDate = date("Y-m-d H:i:s"); 
								include_once('./FonctionSQL/publiFunc.php');
								$final = createPubli( $_SESSION['id'] , $titre, $texte, $img, $laDate , $valeurVisi);
								if($final){
									header('Location:MaPage.php?publi=ok');exit();
								}else{
									header('Location:MaPage.php?publi=ko');exit();
								}
					}else{header('Location:MaPage.php?publi=texte');exit();}
				}else{header('Location:MaPage.php?publi=titre');exit();}
			}
			else
			{
				header('Location:MaPage.php');
				exit();
			}
?>