// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function getLogs(token, { limit = 50, offset = 0, level = "", q = "" } = {}, logout, navigate) {
  const params = new URLSearchParams();
  params.set("limit", limit);
  params.set("offset", offset);
  if (level) params.set("level", level);
  if (q) params.set("q", q);
  return await fetchWithAuth(token, `/logs?${params.toString()}`, { method: "GET" }, logout, navigate);
}

export async function getLogLevels(token, logout, navigate) {
  return await fetchWithAuth(token, "/logs/levels", { method: "GET" }, logout, navigate);
}
