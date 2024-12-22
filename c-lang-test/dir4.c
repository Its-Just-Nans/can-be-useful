#include <stdio.h>

#include <sys/stat.h>

int main (void) {
    struct stat buf;
    int x;

    stat("/lib32", &buf);
    if (S_ISLNK(buf.st_mode)) printf (" stat says link\n");
    if (S_ISREG(buf.st_mode)) printf (" stat says file\n");

    lstat("/lib32", &buf);
    if (S_ISLNK(buf.st_mode)) printf ("lstat says link\n");
    if (S_ISREG(buf.st_mode)) printf ("lstat says file\n");

    return 0;
}