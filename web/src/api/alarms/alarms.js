// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function getAlarms(token, logout, navigate) {
  return await fetchWithAuth(token, "/alarm", { method: "GET" }, logout, navigate);
}

export async function createAlarm(token, alarmData, logout, navigate) {
  return await fetchWithAuth(token, "/alarm", {
    method: "POST",
    body: JSON.stringify(alarmData)
  }, logout, navigate);
}

export async function updateAlarm(token, id, alarmData, logout, navigate) {
  return await fetchWithAuth(token, `/alarm/${id}`, {
    method: "PUT",
    body: JSON.stringify(alarmData)
  }, logout, navigate);
}

export async function deleteAlarm(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/alarm/${id}`, {
    method: "DELETE"
  }, logout, navigate);
}

export async function activateAlarm(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/alarm/activate`, {
    method: "POST",
    body: JSON.stringify({ id }),
  }, logout, navigate);
}

export async function deactivateAlarm(token, logout, navigate) {
  return await fetchWithAuth(token, `/alarm/deactivate`, { method: "POST", }, logout, navigate);
}