export const API = import.meta.env.VITE_API_BASE || "/api";
const json = (r) => r.json();

export const rightsAll = () =>
  fetch(`${API}/rights`, { credentials: "include" }).then(json);

export const rightsByState = (code) =>
  fetch(`${API}/rights?state=${encodeURIComponent(code)}`, {
    credentials: "include",
  }).then(json);

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

export async function getAllSizes() {
  const res = await fetch(`${API}/sizes`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load sizes");
  return res.json();
}

export async function getSizeByWeek(week) {
  const res = await fetch(`${API}/sizes/${week}`, { credentials: "include" });
  if (!res.ok) throw new Error("Size not found");
  return res.json();
}
