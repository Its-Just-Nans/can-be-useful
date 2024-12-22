#include <stdio.h>
int main()
{
    //! showMemory(start=272)
    //HORIZONTAL
    char test[9][9];
    int colonne=0;
    int ligne=0;
    int chiffreColonne=4;
    int chiffreLigne=4;
    int compteur=0;
    int *ptrCompteur;
    ptrCompteur = &compteur;
    for(int y=0; y<9; y++)
    {
        test[colonne][y]=ptrCompteur;
        compteur++;
        printf("%c\n", test[colonne][y]);
    }


    for(int a = 0; a<9; a++)
    {
        ligne = chiffreLigne;
        colonne = a;
        if(test[colonne][ligne] == test[chiffreColonne][chiffreLigne])
        {
            printf("null\n");
        }
    }
    return 0;
}
