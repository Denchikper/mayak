// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function schedulesListGet(token, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/schedules", { method: "GET" }, logout, navigate);
}

export async function schedulesActiveListGet(token, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/schedules/active", { method: "GET" }, logout, navigate);
}

export async function activateSchedule(token, schedulesId, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/schedules/activate/${schedulesId}`, {
    method: "PUT"
  }, logout, navigate);
}

export async function deactivateSchedule(token, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/schedules/deactivate", { method: "PUT" }, logout, navigate);
}

export async function deleteSchedules(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/schedules/${id}`, { method: "DELETE" }, logout, navigate);
}

export async function schedulesCreate(token, name, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/schedules", {
    method: "POST",
    body: JSON.stringify({ name })
  }, logout, navigate);
}

export async function schedulesUpdate(token, id, schedulesData, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/schedules/${id}`, {
    method: "PUT",
    body: JSON.stringify(schedulesData)
  }, logout, navigate);
}