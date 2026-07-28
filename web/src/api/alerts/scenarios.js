// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function scenariosGet(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/scenarios/bySchedule/${id}`, { method: "GET" }, logout, navigate);
}

export async function scenariosGetByDay(token, schedule_id, day_id, logout, navigate) {
  return await fetchWithAuth(token, `/alerts/scenarios/byday/`, { 
    method: "POST",
    body: JSON.stringify({scheduleId: schedule_id, dayId: day_id}) 
  }, logout, navigate);
}

export async function scenariosCreate(token, scenariosData, logout, navigate) {
  return await fetchWithAuth(token, "/alerts/scenarios", {
    method: "POST",
    body: JSON.stringify(scenariosData)
  }, logout, navigate);
}