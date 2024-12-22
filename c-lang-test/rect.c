#include <stdio.h>
#include <stdlib.h>

#define T 3
#define L 3

//int checkFile(void);
int chaineActuelle[(T*L)];

int main ()
{
	int chiffreCase = 0;
	printf("Saisis la case que tu veux\n");
	scanf("%d", &chiffreCase);
	int caseGauche = 99;
	int caseDessus = 99;
	int caseDroite = 99;
	int caseDessous = 99;
	int valeur[4] = {99, 99, 99, 99};
	int nbValeur = 0;
	int numeroValeur = 0;
	int valeurPrise = 0;
	int valeurChoisi = 0;
	printf("Saisis la valeur voulu\n");
	scanf("%d", &valeurPrise);
	for(int z=0;z<(T*L);z++)
	{
		chaineActuelle[z]=0;
	}
	if(chiffreCase > (T*L) || chiffreCase < 0)
	{
	printf("Erreur\n");
	return 1;
	}
	if(chiffreCase == 0)
	{
		nbValeur = 2;
		caseDroite = 1;
		caseDessous = T;
	}
	else if(chiffreCase > 0 && chiffreCase < (T-1))
	{
		nbValeur = 3;
		caseGauche = chiffreCase-1;
		caseDroite = chiffreCase+1;
		caseDessous = chiffreCase + T;
	}
	else if(chiffreCase == (T-1))
	{
		nbValeur = 2;
		caseGauche = chiffreCase-1;
		caseDessous = chiffreCase + T;
	}
	else if(chiffreCase%T == 0)
	{
		if(chiffreCase == (T*(L-1)))
		{
			nbValeur = 2;
			caseDessus = chiffreCase - T;
			caseDroite = chiffreCase + 1;
		}
		else
		{
			nbValeur = 3;
			caseDessus = chiffreCase - T;
			caseDroite = chiffreCase + 1;
			caseDessous = chiffreCase + T;
		}
	}
	else if((chiffreCase+1)%T == 0)
	{
		if(chiffreCase == ((T*L)-1))
		{
			nbValeur = 2;
			caseGauche = chiffreCase - 1;
			caseDessus = chiffreCase - T;
		}
		else
		{
			nbValeur = 3;
			caseDessus = chiffreCase - T;
			caseGauche = chiffreCase - 1;
			caseDessous = chiffreCase + T;
		}
	}
	else if(chiffreCase > (T*(L-1)) && chiffreCase < ((T*L)-1) )
	{
		nbValeur = 3;
		caseGauche = chiffreCase-1;
		caseDessus = chiffreCase - T;
		caseDroite = chiffreCase + 1;
	}
	else
	{
		nbValeur = 4;
		caseGauche = chiffreCase - 1;
		caseDessus = chiffreCase - T;
		caseDroite = chiffreCase + 1;
		caseDessous = chiffreCase + T;
	}
	if(chaineActuelle[caseGauche] == 1 && chaineActuelle[caseDroite] != 99)
	{
		nbValeur--;
	}
	if(chaineActuelle[caseDessus] == 1 && chaineActuelle[caseDroite] != 99)
	{
		nbValeur--;
	}
	if(chaineActuelle[caseDroite] == 1 && chaineActuelle[caseDroite] != 99)
	{
		nbValeur--;
	}
	if(chaineActuelle[caseDessous] == 1 && chaineActuelle[caseDroite] != 99)
	{
		nbValeur--;
	}
	//afficheur du tableau
	if(caseGauche != 99)
	{
		valeur[0] = caseGauche;
	}
	if(caseDessus != 99)
	{
		if(valeur[0] != 99)
		{
			valeur[1] = caseDessus;
		}
		else
		{
			valeur[0] = caseDessus;
		}
	}
	if(caseDroite != 99)
	{
		if(valeur[0] != 99)
		{
			if(valeur[1] != 99)
			{
				valeur[2] = caseDroite;
			}
			else
			{
				valeur[1] = caseDroite;
			}
		}
		else
		{
			valeur[0] = caseDessus;
		}
	}
	if(caseDessous != 99)
	{
		if(valeur[0] != 99)
		{
			if(valeur[1] != 99)
			{
				if(valeur[2] != 99)
				{
					valeur[3] = caseDessous;
				}
				else
				{
					valeur[2] = caseDessous;
				}
			}
			else
			{
				valeur[1] = caseDessous;
			}
		}
		else
		{
			valeur[0] = caseDessus;
		}
	}
    if(valeurPrise > nbValeur || valeurPrise <= 0)
    {
        printf("Erreur, valeur Prise\n");
    }
	valeurPrise --;
	switch(nbValeur)
	{
		case 1: if(valeur[valeurPrise] != 99){valeurChoisi = valeur[valeurPrise];}; break;
		case 2: if(valeur[valeurPrise] != 99){valeurChoisi = valeur[valeurPrise];}; break;
		case 3: if(valeur[valeurPrise] != 99){valeurChoisi = valeur[valeurPrise];}; break;
		case 4: if(valeur[valeurPrise] != 99){valeurChoisi = valeur[valeurPrise];}; break;

	}
	int cpt = 0;
	for(int i = 0; i < L; i++)
	{
		for(int z = 0; z < T; z++)
		{
			printf("| %3d",cpt);
			cpt++;
		}
	printf("|\n");
	}
	//affichage des valeurs
	printf("chiffreCase = %d\n", chiffreCase);
	printf("caseGauche = %d\n", caseGauche);
	printf("caseDessus = %d\n", caseDessus);
	printf("caseDroite = %d\n", caseDroite);
	printf("caseDessous = %d\n", caseDessous);
	printf("\n");
	printf("   |%2d|\n", caseDessus);
	printf("|%2d|%2d|%2d|\n", caseGauche, chiffreCase, caseDroite);
	printf("   |%2d|\n", caseDessous);
	printf("nbValeur= %d\n", nbValeur);
	printf("Valeur1 = %d, Valeur2 = %d, Valeur3 = %d, Valeur4 = %d\n", valeur[0], valeur[1], valeur[2], valeur[3]);
	printf("La valeur choisis est %d\n", valeurChoisi);
	//checkFile();
}

/*
int checkFile(void)
{
	FILE *fichier;
	fichier = fopen("essai.txt", "r" );
	int* chaineFichier = NULL;
	chaineFichier = malloc((T*L) * sizeof(1));

	if(fichier != NULL)
	{
		for(int i=0;i<(T*L);i++)
		{
			fscanf(fichier, "%d ", chaineFichier[i]);
		}
		fclose(fichier);
	}

	if(strcmp(chaineFichier, chaineActuelle) != 0)
	{
		if(fichier != NULL)
		{
			for(int i=0;i<(T*L);i++)
			{
				fprintf(fichier, "%d ", chaineActuelle[i]);
			}
			fclose(fichier);
		}
	}
	free(chaineFichier);
}
*/
