const router = require("express").Router();
const {
  getAllWeeks,
  getWeeksId,
  createWeeks,
  updateWeeks,
  deleteWeeks,
} = require("../db/helpers/weeks");

// GET - /api/weeks - get all weeks
router.get("/", async (req, res, next) => {
  try {
    const weeks = await getAllWeeks();
    res.send(weeks);
  } catch (error) {
    next(error);
  }
});
// GET- /api/weeks/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const weeks = await getWeeksId(id);
    res.send(weeks);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const weeks = await createWeeks(req.body);
    res.send(weeks);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const weeks = await updateWeeks(req.params.id, req.body);
    res.send(weeks);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const weeks = await deleteWeeks(req.params.id);
    res.send(weeks);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
