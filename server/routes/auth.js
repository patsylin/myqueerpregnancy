// server/routes/auth.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /auth/register  body: { email, password, name?, dueDate: 'YYYY-MM-DD' }
router.post("/register", async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password, name, dueDate } = req.body || {};
    if (!email || !password || !dueDate) {
      return res
        .status(400)
        .json({ error: "email, password, and dueDate are required" });
    }

    // basic due date validation (between -1 and +45 weeks from today)
    const d = new Date(dueDate);
    if (Number.isNaN(d.getTime()))
      return res.status(400).json({ error: "Invalid dueDate" });

    await client.query("BEGIN");

    // create user
    const hash = await bcrypt.hash(password, 10);
    const { rows: urows } = await client.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1,$2,$3)
       RETURNING id, email, name`,
      [email, hash, name || null]
    );
    const user = urows[0];

    // create pregnancy (enforced unique(user_id) by DB)
    await client.query(
      `INSERT INTO pregnancies (user_id, due_date)
       VALUES ($1, $2)`,
      [user.id, dueDate]
    );

    await client.query("COMMIT");

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    await client.query("ROLLBACK");
    // unique email error handling (optional)
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }
    console.error("POST /auth/register", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});
