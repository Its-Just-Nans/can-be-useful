#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *strcat2(char *string1, char *string2)
{
    int count1 = strlen(string1);
    int count2 = strlen(string2);
    char *newPTR = (char *)realloc(string1, (count1 + count2) * sizeof(char));
    strcpy(newPTR + count1, string2);
    return newPTR;
}

int main()
{
    char *df = malloc(6 * sizeof(char));
    strcpy(df, "hello");
    char *word = "coucou";
    char *newString = strcat2(df, word);
    printf("%s\n", newString);
}