const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
  const token = req.cookies?.token; // <-- UNSIGNED cookie
  if (!token) return res.status(401).json({ ok: false, message: "No token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
};
