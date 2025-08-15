const fs = require("fs");
const path = require("path");
const ms = require("ms");

const CACHE_FILE = path.join(__dirname, "..", ".cache", "rights.cache.json");

function readCacheFile() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    return { entries: {}, savedAt: null };
  }
}
function writeCacheFile(cache) {
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

const cache = readCacheFile();

function get(key, ttl = "12h") {
  const hit = cache.entries[key];
  if (!hit) return null;
  const freshUntil = hit.cachedAt + ms(ttl);
  if (Date.now() > freshUntil) return null;
  return hit.data;
}
function set(key, data) {
  cache.entries[key] = { data, cachedAt: Date.now() };
  cache.savedAt = new Date().toISOString();
  writeCacheFile(cache);
}

module.exports = { get, set };
