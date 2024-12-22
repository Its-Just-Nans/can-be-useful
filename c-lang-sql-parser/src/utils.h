void customPrintf(char *c, char *value);
void printSpace(int count);
void printReturn();
void printOneSpace();
void printObject(struct object *currentObj, int tabs);
void printObjectToFile(struct object *currentObj, char *output_filename, int tabs);
void customPrintObject(struct object *currentObj, int tabs);