#include <ETH.h>
#include "wsHandler.h"
#include "nrfHandler.h"
#include "secrets.h"

// ---- Dev/Prod ----
#define DEV_PIN 3

bool isDev = false;
const char* ETH_HOSTNAME = "System-control-alerts-receiver_device_3";

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

// ---- nRF24 пины ----
#define NRF_CE   4
#define NRF_CSN  2
#define NRF_SCK  14
#define NRF_MOSI 15
#define NRF_MISO 5

String nrfBuffer = "";

// Колбэк для приёма nRF
void onNRFReceive(const char* data, size_t len) {
    if (!client.available()) return;

    // data уже полный JSON
    StaticJsonDocument<300> doc;
    doc["type"] = "remoteCommand";
    doc["receiver_id"] = 1;

    StaticJsonDocument<200> arduinoDoc;
    DeserializationError err = deserializeJson(arduinoDoc, data, len);

    if(err) {
        // Если JSON битый (маловероятно)
        doc["data"] = String(data).substring(0, len);
    } else {
        // Отлично — передаём как JSON
        doc["data"] = arduinoDoc;
    }

    String json;
    serializeJson(doc, json);
    client.send(json); // отправляем на сервер
}

void setup() {
    delay(1000);

    // 🔹 DEV / PROD переключатель
    pinMode(DEV_PIN, INPUT_PULLUP);
    delay(10); // защита от дребезга
    isDev = (digitalRead(DEV_PIN) == LOW);

    ETH.begin();
    ETH.setHostname(ETH_HOSTNAME);

    if (isDev) {
        ETH.config(dev_IP, dev_gateway, dev_subnet, dev_dns, dev_dns);
    } else {
        ETH.config(prod_IP, prod_gateway, prod_subnet, prod_dns, prod_dns);
    }

    while (!ETH.linkUp()) {
        delay(100);
    }

    if (isDev)
        connectToServer(dev_ws);
    else
        connectToServer(prod_ws);

    initNRF(NRF_CE, NRF_CSN, NRF_SCK, NRF_MOSI, NRF_MISO);
}

void loop() {
    pollWS();                // WebSocket
    pollNRF(onNRFReceive);   // Проверка nRF24
}