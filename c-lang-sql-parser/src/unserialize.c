#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "struct.h"
#include "utils.h"

int readWord(FILE *file, char *buffer)
{
    int index = 0;
    char currentChar;
    int is_escaped_string = 0;
    while (100 != index && (currentChar = getc(file)) != EOF)
    {
        if (currentChar == '[')
        {
            is_escaped_string = 1;
        }
        else if (currentChar == ']')
        {
            is_escaped_string = 0;
        }
        else if (currentChar == ' ' || currentChar == '\n' || currentChar == ',' || currentChar == '\t')
        {
            if (is_escaped_string == 0 && strlen(buffer) > 0)
            {
                buffer[index] = '\0';
                if (strncmp("--", buffer, strlen("--")) == 0)
                {
                    while ((currentChar = getc(file)) != EOF && currentChar != '\n')
                    {
                        // move
                    }
                    return readWord(file, buffer);
                }
                return 0;
            }
            else
            {
                if (is_escaped_string == 0)
                {
                    // start of the word, we pass
                    continue;
                }
            }
        }
        buffer[index++] = currentChar;
    }
    buffer[index] = '\0';
    return 1;
}

void handleSelect()
{
}

void clearBuffer(char *buffer)
{
    int len = strlen(buffer);
    for (int i = 0; i < len; i++)
    {
        buffer[i] = '\0';
    }
}

struct object *createNewObject(struct object *potentialParent)
{
    struct object *newObject = malloc(sizeof(struct object));
    newObject->params = NULL;
    newObject->paramCount = 0;
    newObject->parent = potentialParent;
    newObject->type = "";
    return newObject;
}

void allocateParams(struct object *parentNode)
{
    if (parentNode != NULL)
    {
        if (parentNode->params == NULL)
        {
            parentNode->params = malloc(sizeof(struct object *));
            if (parentNode->params == NULL)
            {
                printf("Error malloc\n");
            }
            parentNode->paramCount = 1;
        }
        else
        {
            parentNode->params = realloc(parentNode->params, sizeof(struct object *) * (parentNode->paramCount + 1));
            if (parentNode->params == NULL)
            {
                printf("Error malloc\n");
            }
            parentNode->paramCount = parentNode->paramCount + 1;
        }
    }
}

struct object *addParams(struct object *parentNode)
{
    allocateParams(parentNode);
    struct object *newObject = createNewObject(parentNode);
    if (parentNode != NULL)
    {
        parentNode->params[parentNode->paramCount - 1] = newObject;
    }
    return newObject;
}

int compareWord(char *str1, char *str2)
{
    if (strcasecmp(str1, str2) == 0)
    {
        return 1;
    }
    return 0;
}

int temp = 0;

struct object *unserialize(FILE *file, char *buffer, struct object *currentNode, struct object *parentNode)
{
    if (currentNode == NULL)
    {
        struct object *parent = addParams(currentNode); // currentNode = NULL
        parent->type = "REQUEST";
        if (parentNode == NULL)
        {
            parentNode = parent;
            currentNode = parent;
        }
    }
    clearBuffer(buffer);
    int isFinished = readWord(file, buffer);
    if (compareWord(currentNode->type, "AS") && currentNode->paramCount == 2)
    {
        struct object *parent = currentNode->parent;
        currentNode = parentNode;
        parentNode = parent;
    }
    if (compareWord(currentNode->type, "=") && currentNode->paramCount == 2)
    {

        if (compareWord(buffer, "AND"))
        {
            struct object *parent = currentNode->parent;
            currentNode = parentNode;
            parentNode = parent;
        }
    }
    if (compareWord(currentNode->type, "AND") && currentNode->paramCount == 2)
    {
    }
    if (compareWord(buffer, "("))
    {
        if (!compareWord(parentNode->type, "REQUEST"))
        {

            struct object *newObject = addParams(currentNode);
            newObject->type = "REQUEST";
            newObject->parent = currentNode;
            parentNode = newObject;
            currentNode = newObject;
        }
    }
    else if (compareWord(buffer, ")"))
    {
        if (currentNode->parent)
        {
            // currentNode = currentNode->parent;
            // parentNode = currentNode->parent->parent->parent;
        }
        // struct object *finder = currentNode;
        // while (!compareWord(finder->type, "REQUEST"))
        // {
        //     finder = finder->parent;
        // }
        // currentNode = finder->parent;
        // parentNode = finder->parent;
    }
    else if (compareWord(buffer, "SELECT"))
    {
        struct object *newObject = addParams(parentNode);
        newObject->type = "SELECT";
        currentNode = newObject;
    }
    else if (compareWord(buffer, "FROM"))
    {
        struct object *newObject = addParams(parentNode);
        newObject->type = "FROM";
        currentNode = newObject;
    }
    else if (compareWord(buffer, "WHERE"))
    {
        struct object *newObject = addParams(parentNode);
        newObject->type = "WHERE";
        currentNode = newObject;
    }
    else if (compareWord(buffer, "AS") || compareWord(buffer, "AND") || compareWord(buffer, "="))
    {

        // get last params
        if (currentNode->paramCount > 0)
        {
            struct object *lastObject = currentNode->params[currentNode->paramCount - 1];
            struct object *asObject = createNewObject(currentNode);
            asObject->parent = currentNode->parent;
            if (compareWord(buffer, "AS"))
            {
                asObject->type = "AS";
            }
            else if (compareWord(buffer, "AND"))
            {
                asObject->type = "AND";
            }
            else if (compareWord(buffer, "="))
            {
                asObject->type = "=";
            }
            allocateParams(asObject);
            asObject->params[0] = lastObject;
            currentNode->params[currentNode->paramCount - 1] = asObject;
            parentNode = currentNode;
            currentNode = asObject;
        }
    }
    else
    {
        struct object *newObject = addParams(currentNode);
        newObject->type = "VALUE";
        strcpy(newObject->value, buffer);
    }
    if (!isFinished)
    {
        unserialize(file, buffer, currentNode, parentNode);
    }
    return parentNode;
}

void dobbyFree(struct object *toFree, unsigned char verbose)
{
    if (toFree->params != NULL)
    {
        for (int i = toFree->paramCount - 1; i >= 0; i--)
        {
            dobbyFree(toFree->params[i], verbose);
            toFree->params[i] = NULL;
            toFree->paramCount = toFree->paramCount - 1;
        }
        free(toFree->params);
        toFree->params = NULL;
    }
    if (verbose)
    {
        printf("dobby: %s is free\n", toFree->type);
    }
    free(toFree);
    toFree = NULL;
}

struct object *unserializeFile(char *filename)
{
    FILE *file = fopen(filename, "r");
    struct object *final = NULL;
    if (file == NULL)
    {
        printf("file not found");
        return final;
    }
    char buffer[100];
    char currentChar = (char)getc(file);
    if (currentChar != EOF)
    {
        rewind(file);
        final = unserialize(file, buffer, NULL, NULL);
    }
    fclose(file);
    return final;
}

int unserializeFile2(char *filename)
{
    struct object *final = unserializeFile(filename);
    printObject(final, 0);
    printReturn();
    dobbyFree(final, 0);
    return 1;
}

int unserializeFileToFile(char *filename, char *output_filename)
{
    struct object *final = unserializeFile(filename);
    printObjectToFile(final, output_filename, 0);
    printReturn();
    dobbyFree(final, 0);
    return 1;
}