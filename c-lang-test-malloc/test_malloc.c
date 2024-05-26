#include <stdio.h>
#include <stdlib.h>

#define TAILLE_NOM 15

struct user
{
    int age;
    char pseudo[TAILLE_NOM];
    char nom[2][TAILLE_NOM];
};

struct user remplir();
void afficheur(struct user *pointeur);

int main()
{
    printf("yo\n");
    printf("Comb de Users ?\n");
    int entier = 0;
    scanf("%d", &entier);
    struct user *tableau;
    tableau = (struct user *)malloc(sizeof(struct user) * entier);
    for (int z = 0; z < entier; z++)
    {
        tableau[z] = remplir();
    }
    printf("impression tableau\n");
    for (int z = 0; z < entier; z++)
    {
        afficheur(&tableau[z]);
    }
    free(tableau);
}

struct user remplir()
{
    struct user temp;
    printf("Veuillez saisir votre pseudo\n");
    scanf("%s", temp.pseudo);
    printf("Veuillez saisir votre nom\n");
    scanf("%s", temp.nom[0]);
    printf("Veuillez saisir votre prenom\n");
    scanf("%s", temp.nom[1]);
    return temp;
}

void afficheur(struct user *pointeur)
{
    printf("Pseudo = %s\n", (*pointeur).pseudo);
    printf("Nom = %s\n", (*pointeur).nom[0]);
    printf("Prenom = %s\n", (*pointeur).nom[1]);
}