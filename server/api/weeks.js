const express = require("express");
const router = express.Router();

const {
  getAllWeeks,
  getWeekById,
  createWeek,
  updateWeek,
  deleteWeek,
} = require("../db/helpers/weeks");

const log = (...args) => console.log("[/api/weeks]", ...args);

router.get("/", async (req, res, next) => {
  try {
    const rows = await getAllWeeks();
    const weeks = rows.map((w) => {
      const info = (w.info ?? "").toString(); // guard against null/undefined
      // try to strip leading "Baby is (approximately )?the size of a/an "
      const m =
        info.match(/size of an?\s+(.*)$/i) || info.match(/size of\s+(.*)$/i);
      const sizeLabel = (m ? m[1] : info).trim(); // fallback to whole info if no match

      return {
        id: w.id,
        weight: w.weight, // number (double precision)
        size: w.size, // number (double precision)
        info, // original sentence
        sizeLabel, // e.g., "eyeliner brush"
      };
    });

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
    res.json({ success: true, week });
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
