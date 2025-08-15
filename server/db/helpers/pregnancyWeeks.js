const client = require("../client");

const createPregnancyWeeks = async ({ week_id, preg_id }) => {
  const {
    rows: [pregnancyWeeks],
  } = await client.query(
    `
        INSERT INTO pregnancyWeeks(week_id, preg_id)
        VALUES ($1, $2)
        RETURNING *
    `,
    [week_id, preg_id]
  );
  return pregnancyWeeks;
};

module.exports = { createPregnancyWeeks };
