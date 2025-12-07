#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *strcat2(char *string1, char *string2)
{
    int count1 = strlen(string1);
    int count2 = strlen(string2);
    char *newPTR = malloc((count1 + count2) * sizeof(char));
    strcpy(newPTR, string1);
    strcpy(newPTR + count1, string2);
    return newPTR;
}

int main()
{
    char *str1 = "hi";
    char *df = "hello";
    char *newString = strcat2(str1, df);
    printf("%s\n", newString);
    free(newString);
}