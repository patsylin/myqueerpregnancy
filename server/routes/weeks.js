const express = require("express");
const router = express.Router();
const pool = require("../db"); // your pg Pool

// GET /api/weeks/current/:pregnancyId
// -> returns { week, item_name, category, description, approx_length_mm, approx_weight_g, week_summary, image_url }
router.get("/current/:pregnancyId", async (req, res) => {
  try {
    const { pregnancyId } = req.params;

    const { rows } = await pool.query(
      `
      WITH cw AS (
        SELECT gestational_week_from_due_date(p.due_date) AS week
        FROM pregnancies p
        WHERE p.id = $1
      )
      SELECT w.week,
             w.item_name,
             w.category,
             w.description,
             w.approx_length_mm,
             w.approx_weight_g,
             w.week_summary,
             w.image_url
      FROM cw
      JOIN weeks w ON w.week = cw.week;  -- or JOIN nonfood_size_weeks if that's your table name
      `,
      [pregnancyId]
    );

    if (!rows.length)
      return res
        .status(404)
        .json({ error: "No matching week (check due_date or weeks table)" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /api/weeks/current/:pregnancyId", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
