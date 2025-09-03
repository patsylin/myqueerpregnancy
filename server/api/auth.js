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
  getUserByToken,
} = require("../db/helpers/users");

const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

router.get("/", (_req, res) => res.send("WOW! A thing!"));

// UNSIGNED cookie reader
function extractToken(req) {
  const raw = req.headers.authorization || req.cookies?.token;
  if (!raw) return null;
  return raw.startsWith("Bearer ") ? raw.slice(7) : raw;
}

router.get("/me", async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: "No token" });

    const user = await getUserByToken(token); // or jwt.verify + lookup
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

function sendError(res, status, code, message) {
  return res.status(status).json({ error: code, message });
}

router.post("/register", async (req, res) => {
  try {
    const { username, password, dueDate } = req.body || {};
    if (!username || !password || !dueDate) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Username, password, and dueDate are required."
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let user;
    try {
      user = await createUser({ username, password: hashedPassword });
    } catch (err) {
      if (err?.code === "23505") {
        return sendError(
          res,
          409,
          "USERNAME_TAKEN",
          "That username is already in use."
        );
      }
      throw err;
    }

    if (user) delete user.password;

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
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in prod (HTTPS)
      path: "/",
    });

    return res.status(201).json({ user, token });
  } catch (error) {
    return sendError(
      res,
      error.status || 500,
      error.code || "INTERNAL_SERVER_ERROR",
      error.message || "Something went wrong."
    );
  }
});
// server/api/auth.js
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    // TEMP DEBUG (remove after it works)
    console.log("[LOGIN] username:", username);

    // If your DB stores usernames case-sensitively, consider normalizing:
    const lookupName = username?.trim();
    const user = await getUserByUsername(lookupName); // verify this helper

    if (!user) {
      console.log("[LOGIN] user not found");
      return res
        .status(401)
        .send({ ok: false, message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("[LOGIN] bad password");
      return res
        .status(401)
        .send({ ok: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    delete user.password;
    res.send({ user, ok: true, token });
  } catch (error) {
    next(error);
  }
});

// router.post("/login", async (req, res, next) => {
//   try {
//     const { username, password } = req.body || {};
//     const user = await getUserByUsername(username);
//     if (!user)
//       return res
//         .status(401)
//         .send({ ok: false, message: "Invalid credentials" });

//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid)
//       return res
//         .status(401)
//         .send({ ok: false, message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user.id, username: user.username },
//       JWT_SECRET
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: false, // true in prod
//       path: "/",
//     });

//     delete user.password;
//     res.send({ user, ok: true, token });
//   } catch (error) {
//     next(error);
//   }
// });

router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in prod
    path: "/",
  });
  return res.json({ ok: true, message: "Logged out" });
});

module.exports = router;
