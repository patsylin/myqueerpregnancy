const router = require("express").Router();
const {
  createJournalEntry,
  getAllJournalEntries,
  getJournalEntriesByUserId,
  updateJournalEntry,
  deleteJournalEntry,
} = require("../db/helpers/journalEntries");

router.get("/", async (req, res) => {
  try {
    const { userId, week } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const params = [userId];
    const where = ["j.user_id = $1"];
    if (week) {
      params.push(Number(week));
      where.push(`j.week = $${params.length}`);
    }

    const { rows } = await pool.query(
      `
      SELECT j.id, j.user_id, j.pregnancy_id, j.title, j.content, j.week, j.created_at
      FROM journal_entries j
      WHERE ${where.join(" AND ")}
      ORDER BY j.created_at DESC
      `,
      params
    );

    res.json(rows);
  } catch (err) {
    console.error("GET /api/journal", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/journal  body: { userId, content, title? }
router.post("/", async (req, res) => {
  try {
    const { userId, content, title } = req.body || {};
    if (!userId || !content)
      return res.status(400).json({ error: "Missing userId or content" });

    const { rows: preg } = await pool.query(
      `SELECT id, due_date FROM pregnancies WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    if (!preg.length)
      return res.status(400).json({ error: "No pregnancy found for user" });

    const { rows } = await pool.query(
      `
      WITH cw AS (
        SELECT gestational_week_from_due_date($2::date) AS week
      )
      INSERT INTO journal_entries (pregnancy_id, user_id, title, content, week)
      SELECT $1, $3, $4, $5, cw.week
      FROM cw
      RETURNING id, pregnancy_id, user_id, title, content, week, created_at;
      `,
      [preg[0].id, preg[0].due_date, userId, title || null, content]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/journal", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id)
      return res.status(400).json({ error: { message: "valid id required" } });
    const updated = await updateJournalEntry(id, req.body || {});
    if (!updated)
      return res.status(404).json({ error: { message: "entry not found" } });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id)
      return res.status(400).json({ error: { message: "valid id required" } });
    const removed = await deleteJournalEntry(id);
    if (!removed)
      return res.status(404).json({ error: { message: "entry not found" } });
    res.json({ success: true, id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
