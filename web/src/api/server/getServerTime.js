// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

// src/api/time.js
import { fetchWithAuth } from "../fetchWithAuth";

export async function getServerTime(token, logout, navigate) {
  const response = await fetchWithAuth(
    token,
    "/server/server-time",
    { method: "GET" },
    logout,
    navigate
  );

  if (!response?.ok || !response.data?.serverTime) {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      date: now
    };
  }

  // Предполагаем, что сервер возвращает время в UTC
  const serverDate = new Date(response.data.serverTime);
  
  // Корректная конвертация в локальное время пользователя
  const localDate = new Date(serverDate.toISOString());
  
  return {
    hours: localDate.getHours(),
    minutes: localDate.getMinutes(),
    seconds: localDate.getSeconds(),
    date: localDate,
    isoString: serverDate.toISOString()
  };
}