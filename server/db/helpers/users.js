const client = require("../client");

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

const getUserByToken = async (id) => {
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
};

const updateJournal = async (id, body) => {
  const { rows } = await client.query(
    `
    UPDATE users
    SET username = $1, journal = $2
    WHERE id = $3
    returning *;
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
