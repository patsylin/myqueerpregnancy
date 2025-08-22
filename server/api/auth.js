// server/api/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createUser,
  getUserByUsername,
  getUserByToken,
} = require("../db/helpers/users");
const pool = require("../db"); // if you need DB access for pregnancies
const { JWT_SECRET } = process.env;
const { username, password, dueDate } = req.body;

const SALT_ROUNDS = 10;

// simple ping
router.get("/", (_req, res) => res.send("WOW! A thing!"));

// who am I (JWT in Authorization header)
router.get("/me", async (req, res, next) => {
  try {
    const raw = req.headers.authorization;
    if (!raw) return res.status(401).json({ error: "No token" });
    const decoded = jwt.verify(raw, JWT_SECRET);
    const user = await getUserByToken(decoded.id);
    if (!user) return res.status(401).json({ error: "Not a user" });
    delete user.password;
    res.send({ user, ok: true });
  } catch (err) {
    next(err);
  }
});

// REGISTER (username + password + dueDate required)
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, dueDate } = req.body || {};
    if (!username || !password || !dueDate) {
      return res
        .status(400)
        .json({ error: "username, password, and dueDate are required" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser({ username, password: hashedPassword });
    delete user.password;

    // ensure pregnancy row with due date (unique per user enforced at DB)
    await pool.query(
      `INSERT INTO pregnancies (user_id, due_date)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET due_date = EXCLUDED.due_date`,
      [user.id, dueDate]
    );

    // sign a token (your /me uses Authorization header)
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );

    // (optional) also cookie:
    res.cookie("token", token, {
      sameSite: "strict",
      httpOnly: true,
      signed: true,
    });

    res.status(201).send({ user, ok: true, token });
  } catch (error) {
    next(error);
  }
});

// LOGIN (returns needsDueDate for onboarding redirect)
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    const user = await getUserByUsername(username);
    if (!user)
      return res
        .status(401)
        .send({ ok: false, message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res
        .status(401)
        .send({ ok: false, message: "Invalid credentials" });

    // check due date
    const { rows: preg } = await pool.query(
      `SELECT due_date FROM pregnancies WHERE user_id=$1 LIMIT 1`,
      [user.id]
    );
    const needsDueDate = !preg.length || !preg[0].due_date;

    // sign token (to match /me)
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );
    res.cookie("token", token, {
      sameSite: "strict",
      httpOnly: true,
      signed: true,
    });

    delete user.password;
    res.send({ user, ok: true, token, needsDueDate });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (_req, res, next) => {
  try {
    res.clearCookie("token", {
      sameSite: "strict",
      httpOnly: true,
      signed: true,
    });
    res.send({ loggedIn: false, message: "Logged Out" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
