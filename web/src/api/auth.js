// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { API_BASE_URL } from "../config.js";

export async function loginUser({ username, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Неверное имя пользователя или пароль");
      } else if (response.status >= 500) {
        throw new Error("Ошибка сервера. Попробуйте позже");
      } else {
        throw new Error(data.message || "Ошибка при авторизации");
      }
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError") {
      // Это обычно network error (сервер не отвечает)
      throw new Error("Сервер недоступен. Проверьте соединение");
    }

    console.error("❌ Ошибка при авторизации:", err.message);
    throw err;
  }
}
