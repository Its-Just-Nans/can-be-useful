<?php
		if( !isset($_SESSION['mail']))
		{
			header('Location:index.php?msg=nonCo');
			exit();
		}
		$adresse = $_SERVER['PHP_SELF'];
?>

	<section id="info">
				<div class="informations">
					<h2>Vos Informations</h2>
					<img id="imgProfile" src="<?php $filePng='./imgUser/'.$_SESSION['id'].'.png'; if(file_exists($filePng)){ echo $filePng; }else{ echo './imgUser/'.$_SESSION['id'].'.jpg';} ?>" >
					<?php 			
					echo '<h3>';echo $_SESSION['prenom'];  echo ' '; echo $_SESSION['nom']; echo '</h3>';
					include_once('./FonctionSQL/userFunc.php');
					
				if( $adresse != "/parametre.php"){
						echo '<p><a href="./parametre.php">Paramètres</a></p>';
				}
				if( $adresse != "/mur.php"){
						echo '<p><a href="./mur.php">Votre mur</a></p>';
				}		
				if( $adresse != "/Projet/MaPage.php"){
						echo '<p><a href="./MaPage.php">Votre page</a></p>';
				}		
						
				echo '</div>';
				if( $adresse != "/amis.php"){
						echo '<div class="informations">';
							echo '<h2 class="fontNormal" ><a href="./amis.php">Vos Amis</a></h2>';
						echo '</div>';
				}
				if( $adresse != "/photos.php"){
						echo '<div class="informations">';
							echo '<h2 class="fontNormal" ><a href="./photos.php">Vos Photos</a></h2>';
						echo '</div>';
				}
				
				include_once('./FonctionSQL/rechercheFunc.php');
				$DemandeEnvEnCours = demandeEnCours($_SESSION['id'], 'demandeEnv');
				
				if( !empty( $DemandeEnvEnCours) ){
					echo '<div class="informations" id="infoAmi">';
					echo "<p>Demande d'amis envoyées à :</p>";
					foreach($DemandeEnvEnCours as $value){
						echo '<p>- '.getUser("prenom", $value['idUser2']).' '.getUser("nom", $value['idUser2']);
					}
					echo '</div>';
				}
				
	
				$DemandeRecuEnCours = demandeEnCours($_SESSION['id'], 'demandeRecu');
				if( !empty( $DemandeRecuEnCours) ){
					echo '<div class="informations" id="infoAmi">';
					echo "<p>Demande d'ami reçu :</p>";
					foreach($DemandeRecuEnCours as $value){
						echo '<p>- '.getUser("prenom", $value['idUser1']).' '.getUser("nom", $value['idUser1']);
					}
					echo '</div>';
				}
				
				if( (getUserDateSmth("mois", $_SESSION['id']) == date("m")) && (getUserDateSmth("jour", $_SESSION['id']) == date("d")) )
				{
					echo '<div class="informations" id="infoAmi">';
					echo "<h3 style='color:red;'>Bon anniversaire !</h3>";
					echo '</div>';
				}
				include_once('./FonctionSQL/rechercheFunc.php');
				include_once('./FonctionSQL/userFunc.php');
				$anniv = annivAmis($_SESSION['id']);
				if($anniv != false){
					
					foreach($anniv as $boucle){
						if($boucle['idUser1'] == $_SESSION['id']){
							$idPerso = $boucle['idUser2'];
						}else{
							$idPerso = $boucle['idUser1'];
							
						}
						if((getUserDateSmth('mois', $idPerso) == date("m")) && (getUserDateSmth("jour", $idPerso) == date("d")) ){
								echo '<div class="informations" id="infoAmi">';
								echo '<p>C\'est l\'anniversaire de <a href=\'user.php?id='.$idPerso.'\'>'.getUser('prenom', $idPerso).' '.getUser('nom', $idPerso).'</a> !</p>';
								echo '<p>Faites une publication pour le lui souhaiter !</p><p>Ou <a href="https://pic.sopili.net/lnk/-/email-html/show/?text='.getUser('mail',$idPerso	).'" target="_blank">copier son mail</a>, pour lui envoyez un message !</p>';
								echo '</div>';
						}
					}
					
				}

				?>

				<div class="informations" id="newPubli">
					<a href="MaPage.php">
					 <p id="newPublitext">Nouvelle publication</p>
					</a>
				</div>
				
				
			</section>
			
