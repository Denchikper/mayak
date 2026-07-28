// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function getServerStatus(token, logout, navigate) {
  try {
    const res = await fetchWithAuth(token, "/server/server-status", { method: "GET" }, logout, navigate);

    // Если fetch вернул объект ошибки
    if (!res.ok) {
      console.warn("Сервер вернул ошибку при получении статуса:", res.data);
      return {
        devicesList: [],
        serverConnected: false,
        activeAlarm: "Нет активных тревог",
        error: res.data?.error || "Неизвестная ошибка сервера",
      };
    }
    // Если fetch вернул нормальные данные
    const activeAlarm = res.data.activeAlarm ? res.data.activeAlarm.name : "Нет активных тревог";
    return {
      devicesList: Array.isArray(res.data.devicesList) ? res.data.devicesList : [],
      activeAlarm,
      serverConnected: true,
    };

  } catch (err) {
    console.error("Ошибка при получении статуса сервера:", err.message);
    return {
      devicesList: [],
      serverConnected: false,
      activeAlarm: "Нет активных тревог",
      error: "Сервер недоступен",
    };
  }
}
