// server/dbping.js
require("dotenv").config();
const pool = require("./db");

(async () => {
  try {
    const { rows } = await pool.query("SELECT NOW() as now");
    console.log("✅ Database is alive:", rows[0].now.toISOString());
    process.exit(0);
  } catch (err) {
    console.error("❌ Database ping failed:", err.message);
    process.exit(1);
  }
})();
