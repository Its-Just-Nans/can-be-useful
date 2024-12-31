#include <stdio.h>
#include <stdint.h>

void printByte(unsigned int* byte){
    int length = sizeof(*byte);
    length = length * 8;
    //printf("%d %d\n", length, *byte);
    for(int count = 0; count < length; count ++){
        unsigned int temp = (*byte)<<(count);
        printf("%d ", temp>>(length-1));
    }
}

uint8_t main(){
    unsigned int temp;
    temp = 128;
    printByte(&temp);
    return 0;
}

//note that the type can be changed like this
/*
void printByte(uint8_t* byte){
   int length = sizeof(*byte);
   length = length * 8;
   //printf("%d %d\n", length, *byte);
   for(int count = 0; count < length; count ++){
       uint8_t temp = (*byte)<<(count);
       printf("%d ", temp>>(length-1));
   }
}
*/

//if the type is not unsigned, there will be "-1" and not "1"