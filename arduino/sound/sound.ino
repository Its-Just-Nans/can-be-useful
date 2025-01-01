int pin = 3;
int incomingByte = 0;
void setup()
{
    // Open serial communications and wait for port to open:
    pinMode(pin, OUTPUT); // sets the digital pin 13 as output
    Serial.begin(9600);
    while (!Serial)
    {
        ; // wait for serial port to connect. Needed for Native USB only
    }

    Serial.println("Goodnight moon!");
}

void loop() // run over and over
{
    if (Serial.available() > 0)
    {
        incomingByte = Serial.read();
        Serial.print((char)7);
    }
}
