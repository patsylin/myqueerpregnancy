const express = require("express");
const router = express.Router();

router.get("/_dbping", (req, res) => {
  res.json({ ok: true, at: new Date().toISOString() });
});

router.use("/weeks", require("./weeks"));

module.exports = router;
