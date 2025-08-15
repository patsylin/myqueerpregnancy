export function fmtTally(t) {
  if (!t) return "";
  const score =
    typeof t.score === "number"
      ? (Math.round(t.score * 100) / 100).toString()
      : String(t.score);
  const max = t.max ?? 49;
  const level = t.level ? ` ${t.level}` : "";
  return `${score}/${max}${level}`;
}

export function fmtPercent(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  const decimals = Number.isInteger(n) ? 0 : 1;
  return `${n.toFixed(decimals)}%`;
}
