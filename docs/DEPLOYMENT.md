# Деплой

## Какой compose-файл использовать

| Файл | Образы | Сеть | Когда использовать |
|---|---|---|---|
| `docker-compose.yaml` | сборка из исходников | bridge | локальная разработка и тесты |
| `docker-compose.hostnet.yaml` | сборка из исходников | host (только `server`) | прод на Linux, но без CI — собираете прямо на сервере |
| `docker-compose.ghcr.yaml` | готовые из GHCR | bridge | прод, устройствам не важен реальный source IP |
| `docker-compose.ghcr.hostnet.yaml` | готовые из GHCR | host (только `server`) | прод, нужен реальный IP устройств + деплой готовыми образами |

Все четыре файла поднимают `db` (Postgres), `server` и `web`. Переменные окружения — см.
[CONFIGURATION.md](CONFIGURATION.md).

## Локальный запуск (сборка из исходников)

```bash
docker compose up --build        # поднять и собрать
docker compose up --build -d     # то же, в фоне
docker compose build             # пересобрать все образы
docker compose build server      # пересобрать только backend
docker compose build web         # пересобрать только frontend
docker compose down              # остановить
docker compose down -v           # остановить и удалить volume БД
docker compose logs -f           # логи всех сервисов
docker compose logs -f server    # логи backend
docker compose logs -f web       # логи frontend
```

## Host network и реальный IP устройств

В обычном (bridge) режиме backend видит IP подключающихся устройств как адрес докер-бриджа,
а не их реальный IP в сети. Это не ломает подключение устройств (сервер узнаёт их по имени),
но отключает доп. проверку «устройство пришло с ожидаемого IP» — см.
[DEVICES.md](DEVICES.md#проверка-по-ip).

Чтобы backend видел реальный IP — используйте host-network вариант
(`docker-compose.hostnet.yaml` или `docker-compose.ghcr.hostnet.yaml`, доступно только на Linux):

```bash
docker compose -f docker-compose.hostnet.yaml up --build       # сборка из исходников
docker compose -f docker-compose.ghcr.hostnet.yaml up -d       # готовые образы GHCR
```

В host-network режиме `server` слушает `SERVER_PORT` напрямую на хосте (без проброса портов),
а `DATABASE_HOST` по умолчанию `127.0.0.1` — backend обращается к Postgres как обычный сетевой
клиент, а не через bridge DNS-имя `db`.

## Деплой готовыми образами из GHCR

Workflow [`.github/workflows/publish-ghcr.yml`](../.github/workflows/publish-ghcr.yml):

- срабатывает только на push тега `v*` (или вручную через `workflow_dispatch`)
- собирает `server` и `web`, публикует Docker-образы в `ghcr.io` с тегами `latest` и версией тега
- создаёт черновик GitHub Release с автосгенерированными release notes

Образы:

- `ghcr.io/<owner>/mayak-server`
- `ghcr.io/<owner>/mayak-web`

### Сценарий релиза

1. Внести изменения в `server` или `web`, запушить в `main` (сборка образов при этом НЕ запускается)
2. Когда готовы к релизу: `git tag vX.Y.Z && git push origin vX.Y.Z`
3. Дождаться завершения workflow `Publish Docker Images` — соберёт образы и создаст черновик Release
4. Опубликовать (Publish) черновик Release на GitHub
5. На сервере обновить стек:

```bash
docker compose -f docker-compose.ghcr.yaml pull        # или docker-compose.ghcr.hostnet.yaml
docker compose -f docker-compose.ghcr.yaml up -d
```

Если нужно пересоздать контейнеры принудительно:

```bash
docker compose -f docker-compose.ghcr.yaml down
docker compose -f docker-compose.ghcr.yaml up -d
```

Если образы в GHCR приватные, на сервере нужно один раз выполнить `docker login ghcr.io`
(сейчас образы публичные — логин не требуется).

## Первый деплой на чистый сервер

```bash
# 1. Установить Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker

# 2. Скачать конфиг (без клонирования всего репозитория)
mkdir -p ~/mayak && cd ~/mayak
curl -fsSL -o docker-compose.ghcr.hostnet.yaml https://raw.githubusercontent.com/Denchikper/mayak/main/docker-compose.ghcr.hostnet.yaml
curl -fsSL -o .env.example https://raw.githubusercontent.com/Denchikper/mayak/main/.env.example
cp .env.example .env
nano .env   # обязательно сменить DATABASE_PASSWORD и JWT_SECRET

# 3. Поднять стек
docker compose -f docker-compose.ghcr.hostnet.yaml pull
docker compose -f docker-compose.ghcr.hostnet.yaml up -d
docker compose -f docker-compose.ghcr.hostnet.yaml ps
curl -s http://localhost:8080/api/ping
```

## Доступ после запуска

- Frontend: `http://<host>:3000`
- Backend API и WebSocket: `http://<host>:8080`, устройства подключаются напрямую по `ws://<host>:8080`
- Первый вход: **`admin` / `admin`** (создаётся сидом на пустой БД — смените пароль сразу после входа)

## Примечания

- Backend обращается к устройствам по IP из базы как обычный сетевой клиент, поэтому доступ
  к устройствам в LAN должен быть открыт с машины, где запущен Docker.
- Firewall на сервере должен пропускать порты `SERVER_PORT` (8080) и `WEB_PORT` (3000) из
  сети, откуда приходят устройства/пользователи.
