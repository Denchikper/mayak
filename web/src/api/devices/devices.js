// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function getDevices(token, logout, navigate) {
  return await fetchWithAuth(token, "/device", { method: "GET" }, logout, navigate);
}

export async function createDevice(token, deviceData, logout, navigate) {
  return await fetchWithAuth(token, "/device", {
    method: "POST",
    body: JSON.stringify(deviceData)
  }, logout, navigate);
}

export async function updateDevice(token, id, deviceData, logout, navigate) {
  return await fetchWithAuth(token, `/device/${id}`, {
    method: "PUT",
    body: JSON.stringify(deviceData)
  }, logout, navigate);
}

export async function deleteDevice(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/device/${id}`, {
    method: "DELETE"
  }, logout, navigate);
}

export async function regenerateDeviceToken(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/device/${id}/regenerate-token`, {
    method: "POST"
  }, logout, navigate);
}