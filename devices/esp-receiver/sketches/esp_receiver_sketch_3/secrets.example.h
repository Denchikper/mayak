#pragma once

// Шаблон secrets.h. Скопируйте в secrets.h (файл в .gitignore) и заполните
// реальными значениями для конкретного устройства.
//   cp secrets.example.h secrets.h

#define DEV_IP 192,168,1,103
#define DEV_GATEWAY 192,168,1,1
#define DEV_SUBNET 255,255,255,0
#define DEV_DNS 192,168,1,1
#define DEV_WS_URL "ws://192.168.1.99:8080"

#define PROD_IP 172,16,7,103
#define PROD_GATEWAY 172,16,4,2
#define PROD_SUBNET 255,255,248,0
#define PROD_DNS 172,16,4,2
#define PROD_WS_URL "ws://172.16.4.21:8080"

#define DEVICE_AUTH_TOKEN "PASTE_DEVICE_AUTH_TOKEN_HERE"
