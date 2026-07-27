#include <ETH.h>
#include "wsHandler.h"
#include "alarmManager.h"
#include "secrets.h"

#define DEV_PIN 1 

bool isDev = false;
const char* ETH_HOSTNAME = "System-control-alerts-relay_device";


// Dev сеть
IPAddress dev_IP(DEV_IP);
IPAddress dev_gateway(DEV_GATEWAY);
IPAddress dev_subnet(DEV_SUBNET);
IPAddress dev_dns(DEV_DNS);
const char* dev_ws = DEV_WS_URL;

// Prod сеть
IPAddress prod_IP(PROD_IP);
IPAddress prod_gateway(PROD_GATEWAY);
IPAddress prod_subnet(PROD_SUBNET);
IPAddress prod_dns(PROD_DNS);
const char* prod_ws = PROD_WS_URL;

void setup() {
  delay(1000);

  pinMode(DEV_PIN, INPUT_PULLUP);
  isDev = (digitalRead(DEV_PIN) == LOW);

  ETH.begin();
  ETH.setHostname(ETH_HOSTNAME);

  if (isDev) {
    ETH.config(dev_IP, dev_gateway, dev_subnet, dev_dns, dev_dns);
  } else {
    ETH.config(prod_IP, prod_gateway, prod_subnet, prod_dns, prod_dns);
  }

  while(!ETH.linkUp()) delay(100);

  setupAlarm();

  if (isDev) {
    // connectToServer("ws://192.168.1.99:8080");
    connectToServer(dev_ws);
  } else {
    connectToServer(prod_ws);
  }
}

void loop() {
  pollWS();
  updateAlarm();
}