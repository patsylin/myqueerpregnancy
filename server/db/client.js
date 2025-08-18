const { Pool } = require("pg");

const dbName = "queerPregnancyApp";
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`,
});

pool.on("connect", () => {
  console.log("✅ Connected to database:", dbName);
});

pool.on("error", (err) => {
  console.error("❌ Unexpected DB error:", err);
  process.exit(-1); // optional: crash so you notice right away
});

module.exports = pool;
