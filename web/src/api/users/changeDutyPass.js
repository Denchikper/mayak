// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function changeDutyPass(token, logout, navigate) {
  return await fetchWithAuth(token, "/user/duty-change-pass", { method: "PATCH" }, logout, navigate);
}
