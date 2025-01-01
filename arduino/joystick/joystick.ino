
void setup() { Serial.begin(9600); }

void loop() {
  Serial.print("X:");
  Serial.print(analogRead(1), DEC);
  Serial.println();
  Serial.print("Y:");
  Serial.print(analogRead(0), DEC);
  Serial.println();
  Serial.print("Z:");
  Serial.print(analogRead(2) == 0 ? F("ON") : F("OFF"));
  Serial.println();
  delay(1000);
}
