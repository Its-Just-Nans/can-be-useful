#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>

Adafruit_ILI9341 tft = Adafruit_ILI9341(10, 8, 11, 13, 6, 12);

void setup()
{
  pinMode(4, OUTPUT);
  digitalWrite(4, HIGH);
  tft.begin();
  tft.setRotation(1);
  tft.fillScreen(ILI9341_BLACK);
  tft.fillRect(100, 50, 20, 30, tft.color565(255, 255, 0));
}

void loop()
{
}
