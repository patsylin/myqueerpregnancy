// src/lib/navigation.js
export const isExternal = (href = "") => /^https?:\/\//i.test(href);

export function openInNewTab(url) {
  if (!url) return;
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win) win.opener = null;
}

export function safeOnClick(handler) {
  // guards against missing onClick handlers
  return (e) => {
    if (typeof handler === "function") handler(e);
    else console.warn("No onClick provided for:", e.currentTarget);
  };
}
