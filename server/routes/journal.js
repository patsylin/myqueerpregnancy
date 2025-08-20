const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/journal
// body: { pregnancyId, content, title? }
// -> inserts journal entry; computes week from the pregnancy's due_date at insert time
router.post("/", async (req, res) => {
  try {
    const { pregnancyId, content, title } = req.body || {};
    if (!pregnancyId || !content) {
      return res.status(400).json({ error: "Missing pregnancyId or content" });
    }

    const { rows } = await pool.query(
      `
      WITH current_week AS (
        SELECT gestational_week_from_due_date(p.due_date) AS week
        FROM pregnancies p
        WHERE p.id = $1
      )
      INSERT INTO journal_entries (pregnancy_id, title, content, week)
      SELECT $1, $2, $3, cw.week
      FROM current_week cw
      RETURNING id, pregnancy_id, title, content, week, created_at;
      `,
      [pregnancyId, title || null, content]
    );

    if (!rows.length) {
      return res
        .status(400)
        .json({ error: "Could not determine week (check due_date)" });
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/journal", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
