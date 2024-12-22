#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>

void listerRep(char cheminRacine[256], int nombreEspace);

int main(){
	unsigned char chemin1[256];
	printf("Veuillez saisir le chemin\n");
	scanf("%s", chemin1);
	printf("Voici l'abre de :%s\n", chemin1);
	listerRep(chemin1, 0);
	return 0;
}


void listerRep(char cheminRacine[256], int nombreEspace){
	char chemin[256];
	struct dirent *dir;
	DIR* directory = opendir(cheminRacine);
	if(directory){
		while( (dir = readdir(directory)) != NULL){
			if( strcmp((*dir).d_name,".") != 0 && strcmp((*dir).d_name,"..") != 0 && (*dir).d_name[0] != '.'){
				for(int d=0;d<nombreEspace;d++){	
					printf("\t");
				}
				printf("%s\n", (*dir).d_name);
				strcpy(chemin, cheminRacine);
				strcat(chemin, "/");
				strcat(chemin, (*dir).d_name);
				DIR* directory2 = opendir(chemin);
				//printf("chemin = %s\n", chemin);
				if(directory2){
					listerRep(chemin, (nombreEspace+1));
				}
			}
		}
		closedir(directory);
	}else{
		printf("Erreur chemin\n");
	}
}















