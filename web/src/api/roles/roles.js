// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function getRoles(token, logout, navigate) {
  return await fetchWithAuth(token, "/roles", { method: "GET" }, logout, navigate);
}

export async function createRole(token, data, logout, navigate) {
  return await fetchWithAuth(token, "/roles", { method: "POST", body: JSON.stringify(data) }, logout, navigate);
}

export async function updateRole(token, id, data, logout, navigate) {
  return await fetchWithAuth(token, `/roles/${id}`, { method: "PUT", body: JSON.stringify(data) }, logout, navigate);
}

export async function deleteRole(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/roles/${id}`, { method: "DELETE" }, logout, navigate);
}
