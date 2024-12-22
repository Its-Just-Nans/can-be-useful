#include <stdlib.h>
#include <stdint.h>

uint8_t *MEMORY;
int MAX_SIZE;
uint8_t *ptr_memory = NULL;
uint8_t *ptr_adr = NULL;

uint8_t allocator_init(int max_size)
{
    MAX_SIZE = max_size;
    MEMORY = malloc(1 * 1024);
    if (MEMORY == NULL)
    {
        return 1;
    }
    return 0;
};

uint8_t *allocate(unsigned int size)
{
    uint8_t *start_heap = MEMORY + MAX_SIZE * (sizeof(uint8_t *) + sizeof(unsigned int));
    if (ptr_memory == NULL)
    {
        ptr_memory = start_heap;
    }
    return ptr_memory;
};

void allocator_destroy()
{
    free(MEMORY);
}

typedef struct
{
    int a;
    int b;
} MyStruct;

int main()
{
    if (allocator_init(2) == 0)
    {
        MyStruct *toto = (MyStruct *)allocate(sizeof(MyStruct));
        allocator_destroy();
    }
    return 0;
}