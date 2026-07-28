// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function getChannels(token, logout, navigate) {
  return await fetchWithAuth(token, "/channel", { method: "GET" }, logout, navigate);
}
