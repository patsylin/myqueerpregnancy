const client = require("../client");
const util = require("../util");

const createJournalEntry = async ({ user_id, content }) => {
  const {
    rows: [entry],
  } = await client.query(
    `
        INSERT INTO journal_entries(user_id, content)
        VALUES ($1, $2)
        RETURNING *
    `,
    [user_id, content]
  );
  return entry;
};

const getAllJournalEntries = async () => {
  const { rows } = await client.query(
    `SELECT * FROM journal_entries ORDER BY created_at DESC;`
  );
  return rows;
};

const getJournalEntriesByUserId = async (user_id) => {
  const { rows } = await client.query(
    `SELECT * FROM journal_entries WHERE user_id = $1 ORDER BY created_at DESC;`,
    [user_id]
  );
  return rows;
};

async function updateJournalEntry(entryId, fields) {
  const toUpdate = {};
  for (let column in fields) {
    if (fields[column] !== undefined) toUpdate[column] = fields[column];
  }
  let entry;

  if (util.dbFields(toUpdate).insert.length > 0) {
    const { insert, vals } = util.dbFields(toUpdate);
    const { rows } = await client.query(
      `
          UPDATE journal_entries
          SET ${insert}
          WHERE "id"=$${vals.length + 1}
          RETURNING *;
        `,
      [...vals, entryId]
    );
    entry = rows[0];
  }

  return entry;
}

async function deleteJournalEntry(id) {
  const { rows } = await client.query(
    'DELETE FROM journal_entries WHERE "id"=$1 RETURNING *',
    [id]
  );
  return rows[0];
}

module.exports = {
  createJournalEntry,
  getAllJournalEntries,
  getJournalEntriesByUserId,
  updateJournalEntry,
  deleteJournalEntry,
};
