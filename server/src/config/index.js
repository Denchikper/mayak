// Единая точка доступа к переменным окружения с валидацией при старте.
// Модуль подключается уже после dotenv.config() в server.js.

const REQUIRED = ['JWT_SECRET', 'DATABASE_NAME', 'DATABASE_USER', 'DATABASE_PASSWORD', 'DATABASE_HOST'];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Отсутствуют обязательные переменные окружения: ${missing.join(', ')}`);
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',

  // HTTP-сервер
  serverPort: process.env.SERVER_PORT || 8080,
  serverIp: process.env.SERVER_IP, // может быть undefined → слушать на всех интерфейсах

  // База данных
  database: {
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 5432,
  },

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',

  // WebSocket
  wsHeartbeatInterval: parseInt(process.env.WS_HEARTBEAT_DEVICES_INTERVAL, 10) || 30000,

  // Целевые устройство и канал для системного звонка
  relayDeviceId: process.env.RELAY_DEVICE_ID,
  ringChannelId: parseInt(process.env.RING_CHANNEL_ID, 10) || 6,

  // Сколько дней хранить записи журнала (logs); старше — удаляются
  logRetentionDays: parseInt(process.env.LOG_RETENTION_DAYS, 10) || 30,
};

config.isProduction = config.nodeEnv === 'production';

module.exports = config;
