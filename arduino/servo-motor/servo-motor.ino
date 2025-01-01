
void setup() {

  pinMode(8, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  action(5);
}

int counter = 0;
int z = 0;
void loop() {
  /*
  action2(1);
  delay(600);
  action(5);

  delay(1000);

  action(7);
  delay(500);
  action(5);
  delay(1000);
   */
  delay(500);
  action(3);
  delay(500);
  action(1);
  delay(500);
  digitalWrite(8, HIGH);
  delayMicroseconds(205);
  digitalWrite(8, LOW);
  delay(750);
  action(5);
  delay(1000);
}

void action(int nombre) {
  digitalWrite(8, HIGH);
  for (int i = 0; i < nombre; i++) {
    delayMicroseconds(500);
  }
  digitalWrite(8, LOW);
}

void action2(int nombre) {
  digitalWrite(8, HIGH);
  for (int i = 0; i < nombre; i++) {
    delayMicroseconds(50);
  }
  digitalWrite(8, LOW);
}
