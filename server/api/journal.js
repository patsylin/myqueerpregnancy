const router = require("express").Router();
const { updateJournal } = require("../db/helpers/users");
const {
  createJournalEntry,
  getAllJournalEntries,
} = require("../db/helpers/journalEntries");

router.get("/", async (req, res, next) => {
  try {
    const entries = await getAllJournalEntries();
    res.send(entries);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { user_id, text } = req.body;
    const entry = await createJournalEntry({ user_id, content: text });
    res.send(entry);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const journal = await updateJournal(req.params.id, req.body);
    res.send(journal);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
