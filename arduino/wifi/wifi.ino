/*
  WiFiTelnetToSerial - Example Transparent UART to Telnet Server for ESP32
  Copyright (c) 2017 Hristo Gochkov. All rights reserved.
  This file is part of the ESP32 WiFi library for Arduino environment.
  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.
  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.
  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
#include <ESPmDNS.h>
#include <WebServer.h>
#include <WiFi.h>
#include <WiFiClient.h>

#define MAX_SRV_CLIENTS                                                        \
  1 // how many clients should be able to telnet to this ESP32
const char *ssid = "wifi";
const char *password = "pass";

const int led = 13;

WiFiServer serverTelnet(23);               // demarre un serveur sur le port 23
WebServer serverHTML(80);                  // demarre un serveur HTML
WiFiClient serverClients[MAX_SRV_CLIENTS]; // sert a créer des serveurs de
                                           // reponse pour les clients

void serveurBase() {
  digitalWrite(led, 1);
  serverHTML.send(200, "text/plain", "Texte qui s'affichera sur le serveur");
  digitalWrite(led, 0);
}

void setup() {
  pinMode(led, OUTPUT);
  Serial.begin(115200);
  Serial.println("\nConnecting");
  WiFi.begin(ssid, password); // se connecte au serveur defini
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  } // Tant qu'il n'est pas connecté, affiche des points
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  server.begin();
  Serial.println("HTTP server started"); // Affiche des messages et l'adresse IP
  serverHTML.on("/", serveurBase);
  serverHTML.on("/inline", []() {
    serverHTML.send(200, "text/plain", "this works as well");
  }); // Defini une methode avec directement le serveur send.

  if (MDNS.begin("esp32")) {
    Serial.println("MDNS responder started");
  } // Met un DNS ave esp 32 ???? comment ca fonctionne ??

  Serial.print("Ready! Use 'telnet "); // indication pour telnet
  Serial.print(WiFi.localIP());
  Serial.println(" 23' to connect");
}

void loop() {
  serverHTML
      .handleClient(); // active le serveur (s'il est pas activé). voir le .cpp
  /*
  uint8_t i;
  if (wifiMulti.run() == WL_CONNECTED) {
    //check if there are any new clients
    if (server.hasClient()){
      for(i = 0; i < MAX_SRV_CLIENTS; i++){
        //find free/disconnected spot
        if (!serverClients[i] || !serverClients[i].connected()){
          if(serverClients[i]) serverClients[i].stop();
          serverClients[i] = server.available();
          if (!serverClients[i]) Serial.println("available broken");
          Serial.print("New client: ");
          Serial.print(i); Serial.print(' ');
          Serial.println(serverClients[i].remoteIP());
          break;
        }
      }
      if (i >= MAX_SRV_CLIENTS) {
        //no free/disconnected spot so reject
        server.available().stop();
      }
    }
    //check clients for data
    for(i = 0; i < MAX_SRV_CLIENTS; i++){
      if (serverClients[i] && serverClients[i].connected()){
        if(serverClients[i].available()){
          //get data from the telnet client and push it to the UART
          while(serverClients[i].available())
  Serial2.write(serverClients[i].read());
        }
      }
      else {
        if (serverClients[i]) {
          serverClients[i].stop();
        }
      }
    }
    //check UART for data
    if(Serial2.available()){
      size_t len = Serial2.available();
      uint8_t sbuf[len];
      Serial2.readBytes(sbuf, len);
      //push UART data to all connected telnet clients
      for(i = 0; i < MAX_SRV_CLIENTS; i++){
        if (serverClients[i] && serverClients[i].connected()){
          serverClients[i].write(sbuf, len);
          delay(1);
        }
      }
    }
  }
  else {
    Serial.println("WiFi not connected!");
    for(i = 0; i < MAX_SRV_CLIENTS; i++) {
      if (serverClients[i]) serverClients[i].stop();
    }
    delay(1000);
  }
  */
}
