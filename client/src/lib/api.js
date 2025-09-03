// client/src/lib/api.js
export const API = import.meta.env.VITE_API_BASE || "/api";

// safe JSON parse (handles empty bodies)
async function toJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

// generic request helper
async function request(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const body = await toJson(res);
  return { ok: res.ok, status: res.status, ...body };
}

/* ---------- AUTH ---------- */

export function me() {
  return request("/auth/me"); // -> { ok, user?, pregnancy? }
}

export function login(user) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(user),
  }); // -> { ok, user?, message? }
}

export function register(user) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  }); // -> { ok, message? }
}

export function logout() {
  return request("/auth/logout", { method: "POST" }); // -> { ok: true }
}

/* ---------- RIGHTS ---------- */

export function rightsAll() {
  return request("/rights"); // -> { ok, items? } (adjust to your shape)
}

export function rightsByState(code) {
  const q = encodeURIComponent(code);
  return request(`/rights?state=${q}`);
}

/* ---------- SIZES / WEEKS (if used) ---------- */

export function getAllSizes() {
  return request("/sizes"); // -> { ok, ... }
}

export function getSizeByWeek(week) {
  return request(`/sizes/${week}`);
}

/* If you call /weeks/current somewhere */
export function weeksCurrent() {
  return request("/weeks/current");
}
