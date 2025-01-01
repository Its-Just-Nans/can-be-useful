int reader = 7;

void abscisse(int nb, struct matrix *ptr, int temps);
void led(int t);

void setup() {
  pinMode(reader, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void led(int t) {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(t);
  digitalWrite(LED_BUILTIN, LOW);
}

void abscisse(int nb, struct matrix *ptr, int temps) {
  for (int z = 0; z < 8; z++) {
    if ((*ptr).matrice[nb][z] == 1) {
      digitalWrite(pin[z], HIGH);
      delay(temps);
      digitalWrite(pin[z], LOW);
    }
  }
  for (int i = 0; i < 8; i++) {
    digitalWrite(pin[i], HIGH);
  }
}

void loop() {
  delay(500);
  led(500);
  delay(500);
  led(500);
  delay(500);
  led(500);
  delay(500);
  led(500);
  // digitalWrite(reader, HIGH);
  // digitalWrite(reader, LOW);
  // byte var = digitalRead(reader);
  // Serial.print(var);
  // Serial.println();
  delay(1000);
  digitalWrite(reader, HIGH);
  delay(1000);
  digitalWrite(reader, LOW);
  delay(1000);
  digitalWrite(reader, HIGH);
  delay(1000);
  digitalWrite(reader, LOW);
  delay(1000);
  digitalWrite(reader, HIGH);
  delay(1000);
  digitalWrite(reader, LOW);
  delay(1000);
  digitalWrite(reader, HIGH);
  delay(1000);
  digitalWrite(reader, LOW);
}
