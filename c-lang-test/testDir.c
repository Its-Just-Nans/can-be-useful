#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>

void explor();
void renameFile();
void copy();

int main()
{
	unsigned int poubelle = 0;
	do
	{
		
		printf("Que voulez-vous faire ?\n");
		printf("0-> quitter\n");
		printf("1-> lister un répertoire\n");
		printf("2-> copier un fichier\n");
		scanf("%d", &poubelle);
		switch(poubelle)
		{
			case 1 : explor(); break;
			case 2 : copy(); break;
			default : break;
		}
	}while(poubelle != 0);
	return 0;
}

void explor(){
	unsigned char chemin1[256];
	unsigned char chemin2[256];
	printf("Veuillez saisir le chemin\n");
	scanf("%s", chemin1);
	printf("Voici la liste de fichiers dans le repertoire %s\n", chemin1);
	struct dirent *dir;
	// opendir() renvoie un pointeur de type DIR.
	DIR *directory = opendir(chemin1);
	if(directory)
	{
		while( (dir = readdir(directory)) != NULL)
		{
			printf("%s\n", (*dir).d_name);
		}
		closedir(directory);
	}
}

void renameFile(){
	unsigned char chemin1[256];
	unsigned char chemin2[256];
	printf("Veuillez saisir le nom du fichier\n");
	scanf("%s", chemin1);
	printf("Veuillez saisir le nom du fichier copiée\n");
	scanf("%s", chemin2);
	rename(chemin1, chemin2);
}

void copy(){
	unsigned char chemin1[256];
	unsigned char chemin2[256];
	printf("Veuillez saisir le nom du fichier\n");
	scanf("%s", chemin1);
	FILE* fichier1 = fopen(chemin1, "r");
	
	printf("Veuillez saisir le nom du fichier copiée\n");
	scanf("%s", chemin2);
	FILE* fichier2 = fopen(chemin2, "w");
	char caractereActuel;
	if(fichier1 != NULL)
	{
		caractereActuel = fgetc(fichier1);
		while( caractereActuel != EOF)
		{
			fputc(caractereActuel, fichier2);
			caractereActuel = fgetc(fichier1);
		}
		fclose(fichier1);
		fclose(fichier2);
    	}


}