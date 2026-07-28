// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function getPermissionCatalog(token, logout, navigate) {
  return await fetchWithAuth(token, "/user/permissions/catalog", { method: "GET" }, logout, navigate);
}
