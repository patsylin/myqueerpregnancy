const API = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function getAllSizes() {
  const res = await fetch(`${API}/api/sizes`);
  if (!res.ok) throw new Error("Failed to load sizes");
  return res.json();
}

export async function getSizeByWeek(week) {
  const res = await fetch(`${API}/api/sizes/${week}`);
  if (!res.ok) throw new Error("Size not found");
  return res.json();
}
