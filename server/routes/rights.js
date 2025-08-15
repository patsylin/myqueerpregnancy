// server/routes/rights.js
const express = require("express");
const { getRights } = require("../services/rights.service");

const router = express.Router();

function norm(code = "") {
  return String(code).trim().toUpperCase();
}

const STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
  "PR",
];

// GET /api/rights — list states (and which ones have live sources, if you want later)
router.get("/", (_req, res) => {
  res.json({ ok: true, states: STATES });
});

// GET /api/rights/:state — live snapshot (cached) with citations
router.get("/:state", async (req, res) => {
  const state = norm(req.params.state);
  if (!STATES.includes(state)) {
    return res.status(400).json({
      ok: false,
      error: "INVALID_STATE",
      message: "Use a 2-letter state/territory code (e.g., CA, TX, NY).",
      allowed: STATES,
    });
  }

  try {
    const data = await getRights(state, { ttl: "12h" });
    res.json(data);
  } catch (e) {
    console.error("[/api/rights/:state] error:", e);
    res
      .status(502)
      .json({ ok: false, error: "UPSTREAM_FAILED", message: String(e) });
  }
});

module.exports = router;
