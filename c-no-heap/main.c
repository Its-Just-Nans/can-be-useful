#include <string.h>
#include <stdio.h>
#include <fcntl.h>
#include <sys/stat.h> //for the open() permission flags
#include <unistd.h>

void my_printf(char *str)
{
    write(STDOUT_FILENO, str, strlen(str)); // zero allocation ! only syscall !
}

void main()
{
    int file_descriptor = open("test.txt", O_RDONLY, 0); // change flags if necessary
    // printf("%d", file_descriptor);
    int var = 100;
    char int_str[20] = "";
    sprintf(int_str, "%d", file_descriptor);
    my_printf(int_str);
    my_printf("\n");
    if (file_descriptor >= 0)
    {
        char buf[40] = "";
        ssize_t nb_read_char = read(file_descriptor, buf, 10);
        if (nb_read_char > 0)
        {
            my_printf(buf);
        }
    }
    else
    {
        my_printf("bad file_descriptor :(");
        my_printf("Is the file present ?");
    }
    my_printf("\n");
    my_printf("this was a zero heap allocation program :)\n");
    my_printf("gcc -g main.c && valgrind --track-origins=yes ./a.out");
    my_printf("\n");
}
