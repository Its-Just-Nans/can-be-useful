#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>


void explor();
void renameFile();
void copy();

int main()
{
	unsigned char chemin1[256];
	long int size;

	printf("Veuillez saisir le chemin\n");
	scanf("%s", chemin1);
	printf("Voici la liste de fichiers dans le repertoire %s\n", chemin1);
	int compteur = 0;
	struct dirent *dir;
	struct stat filestat;
	DIR* directory = opendir(chemin1);
	if(directory)
	{
		while( (dir = readdir(directory)) != NULL)
		{
			compteur = printf("%s ", (*dir).d_name);
			for(int i=compteur;i<30;i++)
			{
				printf(" ");
			}
			if( strcmp((*dir).d_name,".") != 0 && strcmp((*dir).d_name,"..") != 0)
			{
				FILE* fichier1 = fopen((*dir).d_name, "r");
				fseek(fichier1 , 0, SEEK_END);
				size = ftell(fichier1);
				fclose(fichier1);
				printf("%ld\n", size);
				stat((*dir).d_name,&filestat);
				/* newline included in ctime() output */
				printf("File access time %s",ctime(&filestat.st_atime));
				printf("File modify time %s",ctime(&filestat.st_mtime));
				printf("File changed time %s",ctime(&filestat.st_ctime));
				printf("File birth time %s",ctime(&filestat.st_blksize));
				
			}
			else
			{
				printf("\n");
			}
			printf("\n");
		}
		closedir(directory);
	}
	return 0;
}