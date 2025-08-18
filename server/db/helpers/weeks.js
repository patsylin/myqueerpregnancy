const client = require("../client");
const util = require("../util");

const getAllWeeks = async () => {
  const { rows } = await client.query(`SELECT * FROM weeks ORDER BY id;`);
  console.log("[getAllWeeks] returned", rows.length, "rows");
  return rows;
};

// const getAllWeeks = async () => {
//   try {
//     console.log("[getAllWeeks] querying…");
//     const { rows } = await client.query(`SELECT * FROM weeks ORDER BY id;`);
//     console.log("[getAllWeeks] rows:", rows.length);
//     return rows;
//   } catch (error) {
//     console.error("[getAllWeeks] error:", error);
//     throw error;
//   }
// };

// const getAllWeeks = async () => {
//   try {
//     const { rows } = await client.query(`SELECT * FROM weeks ORDER BY id;`);
//     return rows;
//   } catch (error) {
//     throw error;
//   }
// };

const getWeekById = async (week_id) => {
  try {
    const id = Number(week_id);
    if (!Number.isInteger(id)) return null;

    const {
      rows: [week],
    } = await client.query(`SELECT * FROM weeks WHERE id = $1 LIMIT 1;`, [id]);
    return week || null;
  } catch (error) {
    throw error;
  }
};

const createWeek = async ({ weight, size, info }) => {
  try {
    const {
      rows: [week],
    } = await client.query(
      `
        INSERT INTO weeks(weight, size, info)
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      [weight, size, info]
    );
    return week;
  } catch (error) {
    throw error;
  }
};

async function updateWeek(week_id, fields) {
  try {
    const allowed = ["weight", "size", "info"];
    const toUpdate = {};
    for (let column in fields) {
      if (allowed.includes(column) && fields[column] !== undefined) {
        toUpdate[column] = fields[column];
      }
    }

    if (!Object.keys(toUpdate).length) return await getWeekById(week_id);

    const { insert, vals } = util.dbFields(toUpdate); // e.g. insert: `"weight"=$1, "size"=$2`
    const {
      rows: [week],
    } = await client.query(
      `
        UPDATE weeks
        SET ${insert}
        WHERE id = $${vals.length + 1}
        RETURNING *;
      `,
      [...vals, week_id]
    );
    return week || null;
  } catch (error) {
    throw error;
  }
}

async function deleteWeek(id) {
  try {
    const {
      rows: [deleted],
    } = await client.query(`DELETE FROM weeks WHERE id = $1 RETURNING *;`, [
      id,
    ]);
    return deleted || null;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getAllWeeks,
  getWeekById,
  createWeek,
  updateWeek,
  deleteWeek,
};
