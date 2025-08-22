const express = require("express");
const router = express.Router();

router.get("/_dbping", (req, res) => {
  res.json({ ok: true, at: new Date().toISOString() });
});

router.use("/auth", require("./auth"));
router.use("/weeks", require("./weeks"));
router.use("/journal", require("./journal"));
router.use("/pregnancies", require("./pregnancies"));

module.exports = router;
