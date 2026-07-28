// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { API_BASE_URL } from "../config";
import { jwtDecode } from "jwt-decode";

function isTokenValid(token) {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return now < decoded.exp;
  } catch (err) {
    console.error("Token validation error:", err);
    return false;
  }
}

export async function fetchWithAuth(
  token,
  url,
  options = {},
  logout,
  navigate
) {
  if (!isTokenValid(token)) {
    logout?.();
    navigate?.("/login");

    return {
      ok: false,
      status: 401,
      data: "Токен недействителен",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data;
    const contentType = res.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (res.status === 401) {
      logout?.();
      navigate?.("/login");
    }

    if (!res.ok) {
      return { ok: false, status: res.status, data };
    }

    return { ok: true, status: res.status, data };
  } catch (err) {
    console.error("Ошибка при fetchWithAuth:", err);
    return {
      ok: false,
      status: 0,
      data: err.message || "Network error",
    };
  }
}