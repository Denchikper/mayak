# Маяк — система управления звуковыми оповещениями

## Структура

```bash
mayak/
├── server/                     # Backend (Node.js + Express + WS + Sequelize)
├── web/                        # Frontend (React + Vite + Tailwind)
├── devices/                    # Прошивки и схемы устройств (ESP)
├── docs/                       # Документация
├── docker-compose.yaml         # Обычный запуск (включает PostgreSQL)
├── docker-compose.hostnet.yaml # Linux host network запуск (сборка из исходников)
├── docker-compose.ghcr.yaml    # Запуск готовых образов из GHCR
├── docker-compose.ghcr.hostnet.yaml # Готовые образы GHCR + host network
├── .env.example                # Пример переменных окружения
└── README.md
```

## Переменные окружения

Создайте корневой `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Основные параметры:

```env
# db — имя сервиса PostgreSQL из docker-compose.yaml (БД поднимается вместе с приложением).
# Для docker-compose.hostnet.yaml укажите 127.0.0.1, для внешней БД — её адрес.
DATABASE_HOST=db
DATABASE_NAME=system_control_alerts
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_PORT=5432

SERVER_PORT=2255
WEB_PORT=3000
VITE_API_URL=/api

JWT_SECRET=change-me
JWT_EXPIRES_IN=2h
WS_HEARTBEAT_DEVICES_INTERVAL=30000

# Целевое реле и канал для системного звонка
RELAY_DEVICE_ID=a41942b7-4f77-4b13-90d5-da88294125f1
RING_CHANNEL_ID=6

# Сколько дней хранить записи журнала (logs); старше — удаляются
LOG_RETENTION_DAYS=30
```

Обязательные переменные (`JWT_SECRET`, `DATABASE_*`) проверяются при старте — без них сервер
не запустится с понятной ошибкой.

## База данных и первичные данные

PostgreSQL входит в `docker-compose.yaml` отдельным сервисом `db` (volume `sca-db-data`),
поэтому отдельная установка БД не нужна. При старте сервер сам синхронизирует схему
(`sequelize.sync`) и наполняет её идемпотентным сидом:

- дни недели (Пн–Вс);
- каналы (Пожарная/Ракетная/Воздушная/Химическая тревоги, Звонок, Учебная тревога);
- системная роль `admin` (полный доступ);
- администратор по умолчанию **`admin` / `admin`** — создаётся только если пользователей ещё нет.

> Сразу после первого входа смените пароль администратора (Настройки → Пароль).

## Роли и доступы (RBAC)

Доступ разграничивается ролями. Роль — это набор прав на **разделы** (страницы) и **блоки**
(части интерфейса). Ограничения применяются и на фронте (скрытие UI), и на бэке (проверка прав
в middleware).

- **Настройки → Роли и доступы** — создание/редактирование ролей и галочки прав.
- **Настройки → Пользователи** — создание пользователей и назначение ролей.
- Роль `admin` системная: всегда имеет полный доступ, её нельзя удалить/изменить.

Health-check без авторизации: `GET /api/ping`.

## Аутентификация устройств

Каждое устройство аутентифицируется на WebSocket-сервере по `auth_token`.

- Токен генерируется автоматически при создании устройства в веб-панели и для уже
  существующих устройств при первом запуске сервера (см. лог `DB WARN` с выданным токеном).
- В карточке устройства (страница «Устройства») токен можно скопировать или перевыпустить.
- Полученный токен нужно прошить в устройство: в `wsHandler.cpp` заменить
  `PASTE_DEVICE_AUTH_TOKEN_HERE` на значение `auth_token`. Устройство передаёт его в
  сообщении `register`; при несовпадении сервер отклоняет подключение.

> После включения проверки токена действующие устройства не подключатся, пока в них не
> прошьют актуальный `auth_token`.

## Docker

### Обычный запуск

Поднимает три сервиса одной командой: `db` (PostgreSQL), `server` и `web`.

Запуск сборки и контейнеров:

```bash
docker compose up --build
```

Запуск в фоне:

```bash
docker compose up --build -d
```

Пересобрать все образы:

```bash
docker compose build
```

Пересобрать только backend:

```bash
docker compose build server
```

Пересобрать только frontend:

```bash
docker compose build web
```

Остановить контейнеры:

```bash
docker compose down
```

Остановить контейнеры и удалить volume:

```bash
docker compose down -v
```

Логи всех сервисов:

```bash
docker compose logs -f
```

Логи backend:

```bash
docker compose logs -f server
```

Логи frontend:

```bash
docker compose logs -f web
```

### Linux host network

Этот режим нужен для Linux-хоста, если backend должен видеть реальный IP подключающихся устройств.

Запуск:

```bash
docker compose -f docker-compose.hostnet.yaml up --build
```

Запуск в фоне:

```bash
docker compose -f docker-compose.hostnet.yaml up --build -d
```

Остановить:

```bash
docker compose -f docker-compose.hostnet.yaml down
```

Остановить и удалить volume:

```bash
docker compose -f docker-compose.hostnet.yaml down -v
```

Логи:

```bash
docker compose -f docker-compose.hostnet.yaml logs -f
```

### GitHub Packages / GHCR

В репозитории есть workflow:

[.github/workflows/publish-ghcr.yml](.github/workflows/publish-ghcr.yml)

Что он делает:

- срабатывает только на push тега `v*` (или вручную через `workflow_dispatch`)
- собирает `server` и `web`, публикует Docker-образы в `ghcr.io` с тегами `latest` и версией тега
- создаёт черновик GitHub Release с автосгенерированными release notes

Имена образов:

- `ghcr.io/<owner>/mayak-server`
- `ghcr.io/<owner>/mayak-web`

Запуск из готовых образов GHCR:

```bash
docker compose -f docker-compose.ghcr.yaml pull
docker compose -f docker-compose.ghcr.yaml up -d
```

#### Что нужно для работы CI/CD

- репозиторий должен быть на GitHub
- workflow запускается только на push тега вида `v1.2.3`
- публикация идёт в `ghcr.io` через встроенный `GITHUB_TOKEN`
- образы публикуются автоматически, отдельный ручной логин в workflow не нужен

#### Какие образы публикуются

- backend: `ghcr.io/<owner>/mayak-server`
- frontend: `ghcr.io/<owner>/mayak-web`

Каждый тег публикует `latest` и версию тега (например `v1.2.3`).

#### Как обновлять сервер из GHCR

После публикации новой версии на сервере достаточно выполнить:

```bash
docker compose -f docker-compose.ghcr.yaml pull
docker compose -f docker-compose.ghcr.yaml up -d
```

#### Ручное обновление сервера

Если сервер доступен только из локальной сети, рабочая схема такая:

1. Вы ставите тег `vX.Y.Z` и пушите его (`git push origin vX.Y.Z`)
2. GitHub Actions публикует новые образы в `ghcr.io` и создаёт черновик Release
3. Вы заходите на сервер вручную
4. В папке проекта выполняете:

```bash
docker compose -f docker-compose.ghcr.yaml pull
docker compose -f docker-compose.ghcr.yaml up -d
```

Что делают команды:

- `docker compose -f docker-compose.ghcr.yaml pull` скачивает свежие образы `server` и `web`
- `docker compose -f docker-compose.ghcr.yaml up -d` перезапускает контейнеры на новых образах

Если образы в GHCR приватные, на сервере нужно один раз выполнить:

```bash
docker login ghcr.io
```

Если нужно пересоздать контейнеры принудительно:

```bash
docker compose -f docker-compose.ghcr.yaml down
docker compose -f docker-compose.ghcr.yaml up -d
```

#### Полезный сценарий релиза

1. Внести изменения в `server` или `web`, запушить в `main` (сборка образов при этом НЕ запускается)
2. Когда готовы к релизу: `git tag vX.Y.Z && git push origin vX.Y.Z`
3. Дождаться завершения workflow `Publish Docker Images` — соберёт образы и создаст черновик Release
4. Опубликовать (Publish) черновик Release на GitHub
5. На сервере выполнить `docker compose -f docker-compose.ghcr.yaml pull`
6. На сервере выполнить `docker compose -f docker-compose.ghcr.yaml up -d`

#### Что использовать для деплоя

- для локальной сборки и тестов: `docker-compose.yaml`
- для Linux с реальным IP устройств (сборка из исходников): `docker-compose.hostnet.yaml`
- для запуска уже опубликованных образов из GitHub Packages: `docker-compose.ghcr.yaml`
- для готовых образов GHCR + реальный IP устройств на проде: `docker-compose.ghcr.hostnet.yaml`

## Доступ после запуска

- Frontend: `http://localhost:3000`
- Backend API и WebSocket: `http://localhost:2255`
- Устройства подключаются к backend напрямую по `ws://<host>:2255`
- Первый вход: **`admin` / `admin`** (создаётся сидом на пустой БД — смените пароль).

## Примечания

- В обычном Docker-режиме backend может видеть IP клиента как адрес docker bridge, а не реальный IP устройства.
- Для работы с реальным source IP используйте Linux и `docker-compose.hostnet.yaml`.
- Backend обращается к устройствам по IP из базы как обычный сетевой клиент, поэтому доступ к устройствам в LAN должен быть открыт с машины, где запущен Docker.
