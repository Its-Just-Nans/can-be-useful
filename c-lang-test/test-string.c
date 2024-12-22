#include <stdio.h>
int main()
{
	char string[9] = "123456789abc";
	char chaine[9]= { '1', '2','3','4','5','6','7','8','9'};
	printf("le 0 : %c\n", string[0]);
	printf("le 1 : %c\n", string[1]);
	printf("le 2 : %c\n", string[2]);
	printf("le 3 : %c\n", string[3]);
	printf("le 4 : %c\n", string[4]);
	printf("le 5 : %c\n", string[5]);
	printf("le 6 : %c\n", string[6]);
	printf("le 7 : %c\n", string[7]);
	printf("le 8 : %c\n", string[8]);
	printf("le 9 : %c\n", string[9]);
	printf("le 10 : %c\n", string[10]);
	printf("le 11 : %c\n", string[11]);
	printf("le 12 : %c\n", string[12]);
	printf("le 13 : %c\n", string[13]);
	printf("%s\n", string);
	string[9] = 'e';
	string[10] = 'f';
	string[11] = 'g';
	string[12] = 'h';
	string[13] = 'i';
	printf("le 0 : %c\n", string[0]);
	printf("le 1 : %c\n", string[1]);
	printf("le 2 : %c\n", string[2]);
	printf("le 3 : %c\n", string[3]);
	printf("le 4 : %c\n", string[4]);
	printf("le 5 : %c\n", string[5]);
	printf("le 6 : %c\n", string[6]);
	printf("le 7 : %c\n", string[7]);
	printf("le 8 : %c\n", string[8]);
	printf("le 9 : %c\n", string[9]);
	printf("le 10 : %c\n", string[10]);
	printf("le 11 : %c\n", string[11]);
	printf("le 12 : %c\n", string[12]);
	printf("le 13 : %c\n", string[13]);
	printf("le 14 : %c\n", string[14]);
	printf("le 15 : %c\n", string[15]);
	
	
	printf("La string est finie\n");
	printf("%c\n", chaine[0]);
	printf("%c\n", chaine[1]);
	printf("%c\n", chaine[2]);
	printf("%c\n", chaine[3]);
	printf("%c\n", chaine[4]);
	printf("%c\n", chaine[5]);
	printf("%c\n", chaine[6]);
	printf("%c\n", chaine[7]);
	printf("%c\n", chaine[8]);
	printf("le 9 : %c\n", chaine[9]);
	printf("le 10 : %c\n", chaine[10]);
	printf("%s\n", chaine);
	printf("%s%s\n", chaine, string);
	printf("La chaine est finie\n");
	int tableau[5] = {1,2,3,4,5};
	printf("%s\n", tableau);
}