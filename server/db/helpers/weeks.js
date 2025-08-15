const client = require("../client");
const util = require("../util");

const getAllWeeks = async () => {
  try {
    const { rows } = await client.query(
      `SELECT * FROM weeks;`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getWeeksId = async (week_id) => {
  const {
    rows: [week],
  } = await client.query(
    //need help with rewriting this :
    `
    SELECT * FROM weeks WHERE id = $1
    `,
    [week_id]
  );
  return week;
};

const createWeeks = async ({ weight, size, info }) => {
  const {
    rows: [weeks],
  } = await client.query(
    `
        INSERT INTO weeks(weight, size, info)
        VALUES ($1, $2, $3)
        RETURNING *
    `,
    [weight, size, info]
  );
  return weeks;
};

async function updateWeeks(week_id, fields) {
  try {
    const allowed = ["weight", "size", "info"];
    const toUpdate = {};
    for (let column in fields) {
      if (allowed.includes(column) && fields[column] !== undefined) {
        toUpdate[column] = fields[column];
      }
    }
    let weeks;

    if (util.dbFields(toUpdate).insert.length > 0) {
      const { insert, vals } = util.dbFields(toUpdate);
      const { rows } = await client.query(
        `
          UPDATE weeks
          SET ${insert}
          WHERE "id"=$${vals.length + 1}
          RETURNING *;
        `,
        [...vals, week_id]
      );
      weeks = rows[0];
    }

    return weeks;
  } catch (error) {
    throw error;
  }
}

async function deleteWeeks(id) {
  try {
    const { rows } = await client.query(
      'DELETE FROM weeks WHERE "id"=$1 RETURNING *',
      [id]
    );
    return rows[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getAllWeeks,
  getWeeksId,
  createWeeks,
  updateWeeks,
  deleteWeeks,
};
