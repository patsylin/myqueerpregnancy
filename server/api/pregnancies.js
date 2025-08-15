const router = require("express").Router();
const {
  getAllPregnancies,
  getPregnancyByUserId,
  createPregnancy,
  updatePregnancies,
  deletePregnancy,
} = require("../db/helpers/pregnancy");

// GET - /api/pregnancies - get all pregnancies
router.get("/", async (req, res, next) => {
  try {
    const pregnancies = await getAllPregnancies();
    res.send(pregnancies);
  } catch (error) {
    next(error);
  }
});
// GET- /api/pregnancies/:userId

router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const pregnancies = await getPregnancyByUserId(userId);
    res.send(pregnancies);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const pregnancy = await createPregnancy(req.body);
    res.send(pregnancy);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const pregnancies = await updatePregnancies(req.params.id, req.body);
    res.send(pregnancies);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const pregnancy = await deletePregnancy(req.params.id);
    res.send(pregnancy);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
