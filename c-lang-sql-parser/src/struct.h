#ifndef STRUCT

typedef struct object
{
    int paramCount;
    char *type;
    char value[100];
    struct object **params;
    struct object *parent;
} object;

#endif