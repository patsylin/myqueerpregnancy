// server/api/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../db");
const { gestationalAgeFromDueDate } = require("../lib/gestationalAge");

const {
  createUser,
  getUserByUsername,
  getUserByToken, // your helper should verify token OR accept token & verify inside
} = require("../db/helpers/users");

const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

// ping
router.get("/", (_req, res) => res.send("WOW! A thing!"));

// helper to read Bearer or signed cookie
function extractToken(req) {
  const raw =
    req.headers.authorization || req.signedCookies?.token || req.cookies?.token;
  if (!raw) return null;
  return raw.startsWith("Bearer ") ? raw.slice(7) : raw;
}

// ME (user + computed weeks/days/category)
router.get("/me", async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: "No token" });

    // If getUserByToken expects raw token and verifies internally, this is enough.
    // Otherwise: const { id } = jwt.verify(token, JWT_SECRET); then lookup by id.
    const user = await getUserByToken(token);
    if (!user) return res.status(401).json({ error: "Not a user" });

    delete user.password;

    const { rows } = await pool.query(
      `SELECT due_date, age FROM pregnancies WHERE user_id=$1 LIMIT 1`,
      [user.id]
    );

    let pregnancy = null;
    if (rows.length) {
      const due = rows[0].due_date;
      const { weeks, days, category } = gestationalAgeFromDueDate(due);
      pregnancy = { dueDate: due, weeks, days, category };
    }

    res.send({ user, pregnancy, ok: true });
  } catch (err) {
    next(err);
  }
});

// REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, dueDate } = req.body || {};
    if (!username || !password || !dueDate) {
      return res
        .status(400)
        .json({ error: "username, password, and dueDate are required" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let user;
    try {
      user = await createUser({ username, password: hashedPassword });
    } catch (err) {
      if (err.code === "23505") {
        return res
          .status(409)
          .json({ ok: false, message: "Username already taken" });
      }
      throw err;
    }

    delete user.password;

    const { weeks, days } = gestationalAgeFromDueDate(dueDate);
    const gaDays = weeks * 7 + days;

    await pool.query(
      `INSERT INTO pregnancies (user_id, due_date, age)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id)
       DO UPDATE SET due_date = EXCLUDED.due_date,
                     age      = EXCLUDED.age`,
      [user.id, dueDate, gaDays]
    );

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );

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

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    const user = await getUserByUsername(username);
    if (!user)
      return res
        .status(401)
        .send({ ok: false, message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res
        .status(401)
        .send({ ok: false, message: "Invalid credentials" });

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
    res.send({ user, ok: true, token });
  } catch (error) {
    next(error);
  }
});

// LOGOUT
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
