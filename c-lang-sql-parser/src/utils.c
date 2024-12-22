#include <stdio.h>
#include <string.h>
#include "struct.h"
#define TAB_COUNT 4

int FILE_OUTPUT = 0;
char FILE_NAME[100] = "";

void customPrintf(char *c, char *value)
{
    if (FILE_OUTPUT)
    {

        FILE *file = fopen(FILE_NAME, "a+");
        if (file == NULL)
        {
            printf("file not found");
        }
        fprintf(file, c, value);
        fclose(file);
    }
    else
    {
        printf(c, value);
    }
}

void printSpace(int count)
{
    for (int i = 0; i < count; i++)
    {
        customPrintf(" ", "");
    }
}

void printReturn()
{
    if (TAB_COUNT > 0)
    {
        customPrintf("\n", "");
    }
}

void printOneSpace()
{
    if (TAB_COUNT > 0)
    {
        customPrintf(" ", "");
    }
}

void customPrintObject(struct object *currentObj, int tabs)
{
    // toFile = 1 -> use fprintf
    if (currentObj == NULL)
    {
        customPrintf("OBJECT IS NULL\n", "");
        return;
    }
    printSpace(tabs);
    customPrintf("{", "");
    printReturn();
    printSpace(tabs + TAB_COUNT);
    if (strcmp(currentObj->type, "VALUE") != 0)
    {
        customPrintf("\"type\":", "");
        printOneSpace();
        customPrintf("\"%s\",", currentObj->type);
        printReturn();
        printSpace(tabs + TAB_COUNT);
    }
    if (strcmp(currentObj->type, "VALUE") == 0)
    {
        customPrintf("\"value\":", "");
        printOneSpace();
        customPrintf("\"%s\"", currentObj->value);
        if (currentObj->params != NULL)
        {
            customPrintf(",", "");
            printReturn();
            printSpace(tabs + TAB_COUNT);
        }
    }
    if (currentObj->params != NULL)
    {
        customPrintf("\"params\":", "");
        printOneSpace();
        customPrintf("[", "");
        printReturn();
        int size = currentObj->paramCount;
        for (int i = 0; i < size; i++)
        {
            if (currentObj->params[i] != NULL)
            {
                customPrintObject(currentObj->params[i], tabs + TAB_COUNT * 2);
                if (i != size - 1)
                {
                    customPrintf(",", "");
                    printReturn();
                }
                else
                {
                    printReturn();
                }
            }
        }
        printSpace(tabs + TAB_COUNT);
        customPrintf("]", "");
        printReturn();
    }
    else
    {
        printReturn();
    }
    printSpace(tabs);
    customPrintf("}", "");
}

void printObject(struct object *currentObj, int tabs)
{
    customPrintObject(currentObj, tabs);
}

void printObjectToFile(struct object *currentObj, char *output_filename, int tabs)
{
    FILE_OUTPUT = 1;
    fclose(fopen(output_filename, "w"));
    strcpy(FILE_NAME, output_filename);
    customPrintObject(currentObj, tabs);
}
