
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define MAX_ENTRIES 10000

typedef struct {
    char *name;
    char *val;
} entry;

char *makeword(char *line, char stop);
char *fmakeword(FILE *f, char stop, int *len);
char x2c(char *what);
void unescape_url(char *url);
void plustospace(char *str);


main(int argc, char *argv[]) {
    entry entries[MAX_ENTRIES];
    register int x,m=0;
    int cl;
    FILE *logfile;
    struct timeval *time;
    struct timezone *tzp;

    printf("Content-type: text/html%c%c",10,10);

    if(strcmp(getenv("REQUEST_METHOD"),"POST")) {
        printf("Ce script doit etre reference par METHOD=POST.\n");
        exit(1);
    }
    if(strcmp(getenv("CONTENT_TYPE"),"application/x-www-form-urlencoded")) {
        printf("Ce script decode seulement les resultats de FORM.\n");
        exit(1);
    }

    /* lecture date et temps */
    time = malloc(sizeof(time));
    tzp = malloc(sizeof(tzp));
    gettimeofday(time,tzp);

    cl = atoi(getenv("CONTENT_LENGTH"));

    for(x=0;cl && (!feof(stdin));x++) {
        m=x;
        entries[x].val = fmakeword(stdin,'&',&cl);
        plustospace(entries[x].val);
        unescape_url(entries[x].val);
        entries[x].name = makeword(entries[x].val,'=');
    }

    printf("<H2>Exemple de formulaire</H2>");
    printf("Vous avez tapez les renseignements suivants:<P>%c",10);
    printf("<FONT SIZE=+1><UL>%c",10);

    for(x=0; x <= m; x++) {
        printf("<LI> <code>%s = %s</code>%c",entries[x].name,
               entries[x].val,10);
        fprintf(logfile, "%s = %s\n",entries[x].name,entries[x].val);
    }
    printf("</UL></FONT>%c",10);
    fclose (logfile);
}
