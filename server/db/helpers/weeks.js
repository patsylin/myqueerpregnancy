const pool = require("../index"); // adjust if Pool is exported elsewhere

async function getAllWeeks() {
  const { rows } = await pool.query(`
    SELECT
      week AS id,
      item_name,
      category,
      description,
      approx_length_mm,
      approx_weight_g
    FROM weeks
    ORDER BY week
  `);
  return rows;
}

async function getWeekById(id) {
  const { rows } = await pool.query(
    `
    SELECT
      week AS id,
      item_name,
      category,
      description,
      approx_length_mm,
      approx_weight_g
    FROM weeks
    WHERE week = $1
    `,
    [id]
  );
  return rows[0] || null;
}

async function createWeek(data) {
  const {
    week,
    item_name,
    category,
    description,
    approx_length_mm,
    approx_weight_g,
  } = data;
  const { rows } = await pool.query(
    `
    INSERT INTO weeks (week, item_name, category, description, approx_length_mm, approx_weight_g)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING week AS id, item_name, category, description, approx_length_mm, approx_weight_g
    `,
    [week, item_name, category, description, approx_length_mm, approx_weight_g]
  );
  return rows[0];
}

async function updateWeek(id, data) {
  const {
    item_name,
    category,
    description,
    approx_length_mm,
    approx_weight_g,
  } = data;
  const { rows } = await pool.query(
    `
    UPDATE weeks
       SET item_name = COALESCE($2, item_name),
           category = COALESCE($3, category),
           description = COALESCE($4, description),
           approx_length_mm = COALESCE($5, approx_length_mm),
           approx_weight_g = COALESCE($6, approx_weight_g)
     WHERE week = $1
     RETURNING week AS id, item_name, category, description, approx_length_mm, approx_weight_g
    `,
    [id, item_name, category, description, approx_length_mm, approx_weight_g]
  );
  return rows[0] || null;
}

async function deleteWeek(id) {
  const { rowCount } = await pool.query(`DELETE FROM weeks WHERE week = $1`, [
    id,
  ]);
  return rowCount > 0;
}

module.exports = {
  getAllWeeks,
  getWeekById,
  createWeek,
  updateWeek,
  deleteWeek,
};
