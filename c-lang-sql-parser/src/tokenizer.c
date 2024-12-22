#include <stdio.h>

int create_tokens(char *name_of_file)
{
    FILE *file = fopen(name_of_file, "r");

    fclose(file);
}