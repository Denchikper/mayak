// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { fetchWithAuth } from "../fetchWithAuth";

export async function getUsers(token, logout, navigate) {
  return await fetchWithAuth(token, "/users", { method: "GET" }, logout, navigate);
}

export async function createUser(token, data, logout, navigate) {
  return await fetchWithAuth(token, "/users", { method: "POST", body: JSON.stringify(data) }, logout, navigate);
}

export async function updateUser(token, id, data, logout, navigate) {
  return await fetchWithAuth(token, `/users/${id}`, { method: "PUT", body: JSON.stringify(data) }, logout, navigate);
}

export async function deleteUser(token, id, logout, navigate) {
  return await fetchWithAuth(token, `/users/${id}`, { method: "DELETE" }, logout, navigate);
}

// Смена собственного пароля
export async function changeMyPassword(token, username, new_password, logout, navigate) {
  return await fetchWithAuth(
    token,
    "/user/change-pass",
    { method: "PATCH", body: JSON.stringify({ username, new_password }) },
    logout,
    navigate
  );
}

export async function getProfile(token, logout, navigate) {
  return await fetchWithAuth(token, "/user/get-profile", { method: "GET" }, logout, navigate);
}
