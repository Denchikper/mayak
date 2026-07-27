#include "wsHandler.h"
#include "secrets.h"
#include <ArduinoJson.h>
#include <ArduinoWebsockets.h>

WebsocketsClient client;

const char* NameDevice = "WT32-ETH01_Receiver_Device_1";
// Секрет устройства (auth_token из карточки устройства в веб-панели) — см. secrets.h
const char* DeviceToken = DEVICE_AUTH_TOKEN;

unsigned long lastPing = 0;
unsigned long lastReconnectAttempt = 0;
bool isRegistered = false;  // Флаг регистрации
const char* current_server = nullptr;

void handleMessage(WebsocketsMessage message) {

  StaticJsonDocument<200> doc;
  deserializeJson(doc, message.data());
  String type = doc["type"];

  if(type == "registered") {
    isRegistered = true; // успешно зарегистрировались
    return;
  }

  if(type == "ping") {
    return; // сервер может присылать ping
  }
  
}

// -------------------- Отправка ping --------------------
void sendPing() {
  StaticJsonDocument<100> doc;
  doc["type"] = "ping";
  String json;
  serializeJson(doc, json);
  client.send(json);
}

void connectToServer(const char* ip_server) {
  current_server = ip_server;
  if(client.connect(ip_server)) {
    if(!isRegistered) {
      StaticJsonDocument<200> doc;
      doc["type"] = "register";
      doc["nameDevice"] = NameDevice;
      doc["token"] = DeviceToken;
      String json;
      serializeJson(doc, json);
      client.send(json);
    }
  }
}

void pollWS() {
  client.poll();
  client.onMessage(handleMessage);

  if(millis() - lastPing > 10000) {
    sendPing();
    lastPing = millis();
  }

  if(!client.available()) {
    isRegistered = false;

    unsigned long now = millis();
    if (current_server != nullptr) {
      connectToServer(current_server);
    }
    lastReconnectAttempt = now;
  }
}