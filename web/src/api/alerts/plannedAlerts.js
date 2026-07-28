// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function plannedAlertsListGet(token, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/planned-alerts", { method: "GET" }, logout, navigate);
}

export async function plannedAlertCreate(token, data, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/planned-alerts", {
    method: "POST",
    body: JSON.stringify(data)
  }, logout, navigate);
}

export async function plannedAlertUpdate(token, id, data, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/planned-alerts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  }, logout, navigate);
}

export async function plannedAlertToggle(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/planned-alerts/${id}/toggle`, {
    method: "PATCH"
  }, logout, navigate);
}

export async function plannedAlertDelete(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/planned-alerts/${id}`, {
    method: "DELETE"
  }, logout, navigate);
}
