// server/routes/weeks.js
const express = require("express");
const router = express.Router();

const {
  getAllWeeks,
  getWeekById,
  createWeek,
  updateWeek,
  deleteWeek,
} = require("../db/helpers/weeks");

const jwt = require("jsonwebtoken");
const pool = require("../db"); // pg Pool instance

const log = (...args) => console.log("[/api/weeks]", ...args);

// --- helpers ---
function getUserIdFromReq(req) {
  // prefer signed cookie if cookie-parser was initialized with COOKIE_SECRET
  const token = req.signedCookies?.token || req.cookies?.token;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload?.id || null;
  } catch {
    return null;
  }
}

// derive gestational week from due date; clamp to 1..40
function weekFromDueDate(dueDateStr) {
  const due = new Date(dueDateStr + "T00:00:00Z"); // treat DATE as midnight UTC
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  const daysUntilDue = Math.floor((due - now) / msInDay);
  const gestDays = 280 - daysUntilDue; // 40 weeks * 7 days
  const week = Math.max(1, Math.min(40, Math.floor(gestDays / 7)));
  return week;
}

// --- NEW: GET /api/weeks/current ---
router.get("/current", async (req, res, next) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res
        .status(401)
        .json({ error: "UNAUTHORIZED", message: "Sign in required." });
    }

    // fetch user's due date
    const { rows: preg } = await pool.query(
      "SELECT due_date FROM pregnancies WHERE user_id = $1",
      [userId]
    );
    if (!preg.length || !preg[0].due_date) {
      return res
        .status(404)
        .json({ error: "NO_DUE_DATE", message: "No due date on file." });
    }

    const dueDate = preg[0].due_date.toISOString().slice(0, 10);
    const weekNum = weekFromDueDate(dueDate);

    // fetch week row using your helper
    const weekRow = await getWeekById(weekNum);
    if (!weekRow) {
      return res.status(404).json({
        error: "WEEK_NOT_FOUND",
        message: `No data for week ${weekNum}.`,
      });
    }

    const info = (weekRow.info ?? "").toString();
    const match =
      info.match(/size of an?\s+(.*)$/i) || info.match(/size of\s+(.*)$/i);
    const sizeLabel = (match ? match[1] : info).trim();

    return res.json({
      week: weekRow.id,
      item: sizeLabel, // playful label (e.g., “eyeliner brush”)
      category: weekRow.category ?? null,
      description: weekRow.description ?? null,
      dueDate,
    });
  } catch (err) {
    next(err);
  }
});

// --- existing routes ---

// GET /api/weeks
router.get("/", async (req, res, next) => {
  try {
    const rows = await getAllWeeks();
    const weeks = rows.map((w) => ({
      id: w.id, // aliased from week in your helper
      item: w.item_name,
      category: w.category,
      description: w.description,
      lengthMm: w.approx_length_mm,
      weightG: w.approx_weight_g,
    }));

    res.json({ success: true, weeks });
  } catch (err) {
    next(err);
  }
});

// GET /api/weeks/:id
router.get("/:id", async (req, res, next) => {
  try {
    const week = await getWeekById(req.params.id);
    if (!week)
      return res.status(404).json({ success: false, error: "Not found" });
    return res.json({
      week: weekRow.id, // aliased in your helper
      item: weekRow.item_name,
      category: weekRow.category,
      description: weekRow.description,
      lengthMm: weekRow.approx_length_mm,
      weightG: weekRow.approx_weight_g,
      dueDate,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/weeks
router.post("/", async (req, res, next) => {
  try {
    const week = await createWeek(req.body || {});
    res.status(201).json({ success: true, week });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/weeks/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const week = await updateWeek(req.params.id, req.body || {});
    if (!week)
      return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, week });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/weeks/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteWeek(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, deleted });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
