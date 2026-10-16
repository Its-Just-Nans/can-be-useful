#include <stdio.h>

void to_binary(char res[], unsigned int value) {
  for (int i = 0; i < sizeof(unsigned int) * 8; i++) {
    unsigned int nb = value >> i & 0x1;
    res[sizeof(unsigned int) * 8 - 1 - i] = nb ? '1' : '0';
  }
}

int main() {
  // convertir en binaire
  char res[sizeof(unsigned int) * 8 + 1] = {0};
  for (int i = 0; i < sizeof(unsigned int) * 8; i++) {
    res[i] = '0';
  }
  res[sizeof(unsigned int) * 8] = '\0';
  printf("%s = %d\n", res, 0);

  // test values
  for (int i = 1; i < 16; i++) {
    to_binary(res, i);
    printf("%s = %d\n", res, i);
  }
  return 0;
}
