const router = require("express").Router();
const {
  createJournalEntry,
  getAllJournalEntries,
  getJournalEntriesByUserId,
  updateJournalEntry,
  deleteJournalEntry,
} = require("../db/helpers/journalEntries");

router.get("/", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const entries = userId
      ? await getJournalEntriesByUserId(userId)
      : await getAllJournalEntries();
    res.json(entries || []);
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: { message: "login required" } });

    const { content } = req.body || {};
    if (!content) return res.status(400).json({ error: { message: "content is required" } });

    const entry = await createJournalEntry({ user_id: userId, content });
    res.status(201).json(entry);
  } catch (err) { next(err); }
});


router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: { message: "valid id required" } });
    const updated = await updateJournalEntry(id, req.body || {});
    if (!updated) return res.status(404).json({ error: { message: "entry not found" } });
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: { message: "valid id required" } });
    const removed = await deleteJournalEntry(id);
    if (!removed) return res.status(404).json({ error: { message: "entry not found" } });
    res.json({ success: true, id });
  } catch (err) { next(err); }
});

module.exports = router;
