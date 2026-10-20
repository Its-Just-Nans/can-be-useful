<?php
	session_start();
			if( isset($_POST['addRep']) && !empty($_GET['page']))
			{
			if(htmlspecialchars($_GET['page']) == 'page'){$location = 'Location:MaPage.php';}else if(htmlspecialchars($_GET['page']) == 'mur'){$location = 'Location:mur.php';}else if(htmlspecialchars($_GET['page']) == 'user'){$location = 'Location:user.php';}else{$location = 'Location:index.php';};
					
					if(isset($_POST['idPubli']) && isset($_POST['id1']) && ctype_digit(htmlspecialchars($_POST['idPubli'])))
					{
						include_once('./FonctionSQL/myRegex.php');
						$texte = regexApos(htmlspecialchars($_POST['addRep']));
								$laDate = date("Y-m-d H:i:s"); 
								include_once('./FonctionSQL/publiFunc.php');
								$final = createRep($_SESSION['id'], htmlspecialchars($_POST['idPubli']), $texte, $laDate);
								if($final){
									header($location.'?reponse=ok');exit();
								}else{
									header($location.'?reponse=ko');exit();
								}
					}else{header($location.'?reponse=erreur');exit();}
			}
			else
			{
				header($location);
				exit();
			}
?>
