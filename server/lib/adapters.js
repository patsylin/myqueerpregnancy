// server/lib/adapters.js
// Node 18 global fetch + node-html-parser
const { parse } = require("node-html-parser");
const { URL } = require("url");

function normalize({ state, topic, summary, links }) {
  return {
    ok: true,
    state,
    lastUpdated: new Date().toISOString(),
    parentage_summary: topic === "parentage" ? summary : undefined,
    abortion_summary: topic === "abortion" ? summary : undefined,
    links: links || [],
  };
}

function tidy(text = "", maxChars = 600) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= maxChars) return t;
  const cut = t.slice(0, maxChars);
  const lastDot = cut.lastIndexOf(". ");
  return (lastDot > 200 ? cut.slice(0, lastDot + 1) : cut) + " …";
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "myQueerPregnancyApp/1.0" },
  });
  if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`);
  return res.text();
}

/* ---------- Generic fallback scraper ---------- */
async function scrapeHtmlPage(url, { state, topic }) {
  const html = await fetchHtml(url);
  const root = parse(html);

  const firstArticleP = root.querySelector("article p");
  const firstMainP = root.querySelector("main p");
  const firstP = root.querySelector("p");

  const summary = tidy(
    (firstArticleP && firstArticleP.text) ||
      (firstMainP && firstMainP.text) ||
      (firstP && firstP.text) ||
      "No summary available from source."
  );

  const links = [{ label: "Source", url }];
  root
    .querySelectorAll("a[href]")
    .slice(0, 10)
    .forEach((a) => {
      const href = a.getAttribute("href");
      if (href && /^https?:\/\//.test(href)) {
        const label = (a.text || "").trim() || href;
        links.push({ label, url: href });
      }
    });

  return normalize({ state, topic, summary, links });
}

/* ---------- Site-specific: lgbtmap.org (MAP) ---------- */
async function scrapeLgbtMap(url, { state, topic }) {
  const html = await fetchHtml(url);
  const root = parse(html);

  // --- summary text (existing-ish) ---
  const candidates = [
    "main p",
    ".content p",
    "article p",
    ".state-profile p",
    ".state-profile__summary p",
  ];
  let text = "";
  for (const sel of candidates) {
    const el = root.querySelector(sel);
    if (el && el.text && el.text.trim().length > 60) {
      text = el.text;
      break;
    }
  }
  if (!text) text = root.querySelector("p")?.text || "";
  const summary = tidy(text || "No summary available from source.");

  // --- NEW: extract "Percent of LGBTQ Adults (25+) Raising Children" ---
  // Strategy: find an element whose text contains the label, then grab the nearest percentage.
  function extractRaisingChildrenPct() {
    const labelRe =
      /Percent of\s+LGBTQ\s+Adults\s*\(25\+\)\s*Raising\s*Children/i;
    // scan all elements; stop at the first label hit
    const all = root.querySelectorAll("*");
    for (const el of all) {
      const t = (el.text || "").replace(/\s+/g, " ").trim();
      if (labelRe.test(t)) {
        // 1) try to find a % number in this element
        const here = t.match(/(\d+(?:\.\d+)?)\s*%/);
        if (here) return parseFloat(here[1]);

        // 2) otherwise, search the parent for a nearby % number
        const p = el.parentNode;
        const around = (p?.text || "").replace(/\s+/g, " ");
        const near = around.match(/(\d+(?:\.\d+)?)\s*%/);
        if (near) return parseFloat(near[1]);

        // 3) as a last resort, search the whole page once
        break;
      }
    }
    const pagePct = (root.text || "").match(/(\d+(?:\.\d+)?)\s*%/);
    return pagePct ? parseFloat(pagePct[1]) : null;
  }
  const raisingChildrenPct = extractRaisingChildrenPct();

  // --- tally parsing (improved robustness) ---
  const fullText = (root.text || "").replace(/\s+/g, " ");
  let score = null,
    max = null,
    level = null;

  // Common patterns:
  // "Overall Tally: 8.25/49 Low"   or   "Overall Tally 8 / 49 – Medium"
  let m =
    fullText.match(/Overall Tally[:\s]*([\d.]+)\s*\/\s*(\d+)\s*([A-Za-z]+)/i) ||
    fullText.match(
      /Overall Tally[:\s]*([\d.]+)\s*\/\s*(\d+)\s*[–-]\s*([A-Za-z]+)/i
    );

  // Bonus: try to pick up nearby words if they use a line break or separator
  if (!m) {
    const near = fullText.match(
      /Overall Tally[:\s]*([\d.]+)\s*\/\s*(\d+)(?:\s*\)|\s*)([A-Za-z]+)/i
    );
    if (near) m = near;
  }

  if (m) {
    score = parseFloat(m[1]);
    max = parseInt(m[2], 10);
    level = m[3];
  }

  const links = [{ label: "Source (MAP)", url }];

  return {
    ...normalize({ state, topic, summary, links }),
    parentage_children_pct: Number.isFinite(raisingChildrenPct)
      ? raisingChildrenPct
      : undefined,
    parentage_tally:
      score != null && max != null ? { score, max, level } : undefined,
  };
}

/* ---------- Site-specific: reproductiverights.org (CRR) ---------- */
function isCRR(u) {
  try {
    return /(^|\.)reproductiverights\.org$/i.test(new URL(u).hostname);
  } catch {
    return false;
  }
}

async function scrapeCRR(url, { state, topic }) {
  const html = await fetchHtml(url);
  const root = parse(html);

  // Try to target the first meaningful paragraph in the page body.
  // CRR pages often have content inside <main>, sometimes within .entry-content or article.
  const candidates = [
    "main .entry-content p",
    "main article p",
    "article .entry-content p",
    "article p",
    "main p",
  ];

  let text = "";
  for (const sel of candidates) {
    const el = root.querySelector(sel);
    if (el && el.text && el.text.trim().length > 60) {
      text = el.text;
      break;
    }
  }
  if (!text) text = root.querySelector("p")?.text || "";

  const summary = tidy(text || "No summary available from source.");
  const links = [{ label: "Source (CRR)", url }];
  return normalize({ state, topic, summary, links });
}

/* ---------- Public API ---------- */
module.exports = {
  async getAbortionSnapshot(state, url) {
    if (isCRR(url)) return scrapeCRR(url, { state, topic: "abortion" });
    return scrapeHtmlPage(url, { state, topic: "abortion" });
  },
  async getParentageSnapshot(state, url) {
    if (isLgbtMap(url))
      return scrapeLgbtMap(url, { state, topic: "parentage" });
    return scrapeHtmlPage(url, { state, topic: "parentage" });
  },
};
