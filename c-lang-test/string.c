#include <stdio.h>
#include <string.h>


int main()
{
	unsigned char chemin1[256];
	unsigned char chemin2[256];
	unsigned char chemin3[256];
	unsigned char chemin4[256];
	printf("Veuillez saisir le chemin1\n");
	scanf("%s", chemin1);
	printf("Veuillez saisir le chemin2\n");
	scanf("%s", chemin2);
	strcpy(chemin3, chemin1);
	printf("Voici l'abre de :%s\n", chemin3);
	strcat(chemin1, chemin2);
	printf("Voici l'abre de :%s\n", chemin1);
	return 0;
}







