export const API = import.meta.env.VITE_API_BASE || "/api";

// client/src/lib/api.js
const json = (res) => res.json();

export const register = (user) =>
  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(user),
  }).then(json);

export const login = (user) =>
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(user),
  }).then(json);

export const me = () =>
  fetch(`${API}/auth/me`, { credentials: "include" }).then(json);
