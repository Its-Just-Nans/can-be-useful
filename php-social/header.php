<?php
		if( !isset($_SESSION['mail']))
		{
			header('Location:index.php?msg=nonCo');
			exit();
		}
?>
	<header>
			<div id="titleFront">
				<h1 class="titleBase"><a href="./index.php" class="titleBase">trombinouc</a></h1>
				
			</div>
			<div id="divRecherche">
				<form method="GET" action="./recherche.php" enctype="multipart/form-data" id="formRecherche">
					<input id="recherche" name="recherche" type="text" required placeholder=" Rechercher">
					<button id="boutonLoupe" type="submit"><img src="./img/loupe.png" id="loupe"></button>
				
				</form>
				
			</div>
			<p><a id="deco" href="deco.php"> Deconnexion</a></p>
		</header>