const router = require("express").Router();

router.get("/health", (req, res, next) => {
  res.send("All healthy and ready to go!");
});
router.use("/auth", require("./auth"));
// /api/pregnancies
router.use("/pregnancies", require("./pregnancies"));
//api/weeks
router.use("/weeks", require("./weeks"));

router.use("/journal", require("./journal"));

module.exports = router;
