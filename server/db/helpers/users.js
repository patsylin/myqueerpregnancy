const client = require("../client");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const createUser = async ({ username, password, journal = "" }) => {
  const {
    rows: [user],
  } = await client.query(
    `
      INSERT INTO users(username, password, journal)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [username, password, journal]
  );
  return user;
};

const getUserByUsername = async (username) => {
  const {
    rows: [user],
  } = await client.query(
    `
      SELECT * FROM users
      WHERE users.username = $1
    `,
    [username]
  );
  return user;
};

// FIXED: now expects a JWT string, verifies it, then finds the user
const getUserByToken = async (token) => {
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users
        WHERE users.id = $1
      `,
      [id]
    );
    return user;
  } catch (err) {
    return null; // invalid token
  }
};

const updateJournal = async (id, body) => {
  const { rows } = await client.query(
    `
      UPDATE users
      SET username = $1, journal = $2
      WHERE id = $3
      RETURNING *;
    `,
    [body.username, body.journal, id]
  );
  return rows;
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserByToken,
  updateJournal,
};
