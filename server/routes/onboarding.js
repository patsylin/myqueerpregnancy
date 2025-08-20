// server/routes/onboarding.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// PUT /onboarding/due-date   body: { userId, dueDate }
router.put("/due-date", async (req, res) => {
  try {
    const { userId, dueDate } = req.body || {};
    if (!userId || !dueDate)
      return res.status(400).json({ error: "Missing userId or dueDate" });

    // upsert pregnancy
    await pool.query(
      `
      INSERT INTO pregnancies (user_id, due_date)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE SET due_date = EXCLUDED.due_date
      `,
      [userId, dueDate]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /onboarding/due-date", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
