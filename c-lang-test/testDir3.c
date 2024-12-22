#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>

void listerRep(char cheminRacine[256], int nombreEspace, int optionTree);

int main()
{
	unsigned char chemin1[256];
	printf("Veuillez saisir le chemin\n");
	scanf("%s", chemin1);
	printf("Voici l'abre de :\n%s\n", chemin1);
	listerRep(chemin1, 0, 0);
	return 0;
}

void listerRep(char cheminRacine[256], int nombreEspace, int optionTree)
{
	struct stat buffer;
	char chemin[256];
	struct dirent *dir;
	DIR* directory = opendir(cheminRacine);
	DIR* directory2;
	int long size =0;
	if(directory)
	{
		while( (dir = readdir(directory)) != NULL)
		{
			if( strcmp((*dir).d_name,".") != 0 && strcmp((*dir).d_name,"..") != 0 && (*dir).d_name[0] != '.')
			{
				for(int d=0;d<nombreEspace;d++)
				{	
					printf("\t");
				}
				printf("%s", (*dir).d_name);
				
				
					strcpy(chemin, cheminRacine);
					if(  chemin[(strlen(chemin)-1)] != '/')
					{
						strcat(chemin, "/");
					}
					strcat(chemin, (*dir).d_name);
					//printf("Chemin : '%s'\n", chemin);
					directory2 = opendir(chemin);
					lstat(chemin, &buffer);
					if(directory2 && !( S_ISLNK(buffer.st_mode) ))
					{
						printf("\n");
						if(optionTree == 1)
						{
							//printf("fonction : %s %d %d\n",chemin, (nombreEspace+1), 1);							
							listerRep(chemin, (nombreEspace+1), 1);
						}
						
					}
					else
					{
						//printf("Le chemin est : %s", chemin);	
						FILE* fichier1 = fopen(chemin, "r");
						if(fichier1 != NULL)
						{
							fseek(fichier1 , 0, SEEK_END);
							size = ftell(fichier1);
							fclose(fichier1);
							printf("\t\t%ld", size);
						}
						else
						{
							printf("\t\t0");
						}
						
						
						printf("\n");
					}
					closedir(directory2);
			}
		}
		closedir(directory);
	}
	else
	{
		for(int d=0;d<nombreEspace;d++)
		{	
			printf("\t");
		}
		printf("Erreur chemin : '%s'\n", cheminRacine);
	}

}







