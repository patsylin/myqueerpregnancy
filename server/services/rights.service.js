// server/services/rights.service.js
const { get, set } = require("../lib/cache");
const sources = require("../data/rights.sources");
const {
  getAbortionSnapshot,
  getParentageSnapshot,
} = require("../lib/adapters");
const { slugFor } = require("../data/states");

function cacheKey(state) {
  return `rights:${state}`;
}

// Default URL builders (used if not overridden in rights.sources.js)
function buildAbortionUrl(state) {
  // CRR per-state page using slug: e.g., california, new-york, district-of-columbia
  const slug = slugFor(state);
  return `https://reproductiverights.org/maps/state/${slug}/`;
}
function buildParentageUrl(state) {
  // MAP profile page accepts 2-letter code directly
  return `https://www.lgbtmap.org/equality_maps/profile_state/${state}`;
}

async function fetchLive(state) {
  const merged = {
    ok: true,
    state,
    lastUpdated: new Date().toISOString(),
    parentage_summary: null,
    abortion_summary: null,
    links: [],
    _parts: [],
  };

  // Abortion (CRR)
  try {
    const abUrl =
      (sources?.abortion && sources.abortion[state]) || buildAbortionUrl(state);
    const d = await getParentageSnapshot(state, paUrl);
    merged.parentage_summary = d.parentage_summary ?? merged.parentage_summary;
    if (d.parentage_tally) merged.parentage_tally = d.parentage_tally;
    if (Array.isArray(d.links)) merged.links.push(...d.links);
    merged._parts.push({ ok: true, topic: "parentage" });
  } catch (e) {
    merged._parts.push({ ok: false, topic: "parentage", error: String(e) });
  }

  // Parentage (MAP)
  try {
    const paUrl =
      (sources?.parentage && sources.parentage[state]) ||
      buildParentageUrl(state);
    const d = await getParentageSnapshot(state, paUrl);
    merged.parentage_summary = d.parentage_summary ?? merged.parentage_summary;
    if (Array.isArray(d.links)) merged.links.push(...d.links);
    merged._parts.push({ ok: true, topic: "parentage" });
  } catch (e) {
    merged._parts.push({ ok: false, topic: "parentage", error: String(e) });
  }

  return merged;
}

async function getRights(state, { ttl = "12h", refresh = false } = {}) {
  if (!refresh) {
    const cached = get(cacheKey(state), ttl);
    if (cached) return { ...cached, cached: true };
  }
  const fresh = await fetchLive(state);
  set(cacheKey(state), fresh);
  return { ...fresh, cached: false };
}

module.exports = { getRights };
