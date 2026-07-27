# Маяк — система управления звуковыми оповещениями

## Структура

```bash
mayak/
├── server/                          # Backend (Node.js + Express + WS + Sequelize)
├── web/                             # Frontend (React + Vite + Tailwind)
├── devices/                         # Прошивки и схемы устройств (ESP)
├── docs/                            # Документация
├── docker-compose.yaml              # Локальная сборка из исходников
├── docker-compose.hostnet.yaml      # Сборка из исходников + host network
├── docker-compose.ghcr.yaml         # Готовые образы из GHCR
├── docker-compose.ghcr.hostnet.yaml # Готовые образы GHCR + host network
├── .env.example                     # Пример переменных окружения
└── README.md
```

## Документация

- [Конфигурация (.env, БД, RBAC)](docs/CONFIGURATION.md)
- [Деплой (docker compose, GHCR, релизы)](docs/DEPLOYMENT.md)
- [Устройства (auth_token, проверка по IP)](docs/DEVICES.md)

## Быстрый старт (локально)

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API и WebSocket: `http://localhost:8080`
- Первый вход: **`admin` / `admin`** (создаётся сидом на пустой БД — смените пароль сразу после входа)

Подробности по конфигурации, деплою на прод (host network, GHCR-образы, релизы по тегу)
и подключению устройств — в [docs/](docs/).
