<?php

//fichier contenant des regex utile
//tous est dans le nom de la regex
	function myRegexVoid($string, $LettreAenlever){
		$pattern = "/".$LettreAenlever."/";
		$replacement = '';
		return preg_replace($pattern, $replacement, $string);
	}
	
	function regexSansChiffre($string){
		$pattern = "/[0-9]/";
		$replacement = '';
		return preg_replace($pattern, $replacement, $string);
	}


	function regexApos($string){
		$pattern = "/'/";
		$replacement = '&apos;';
		$resultat = preg_replace($pattern, $replacement, $string);
		$pattern = '/"/';
		$replacement = '&quote;';
		$resultat = preg_replace($pattern, $replacement, $resultat);
		return $resultat;
	}
	
	function regexSansHashtag($string){
		if( preg_match('/#/', $string)){
			return false;
		}else{
			return true;
		}
		
	}
?>
