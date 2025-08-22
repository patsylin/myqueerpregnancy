// server/db/index.js
const { Pool } = require("pg");

// Local dev defaults — adjust as needed or use .env
const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || "queerPregnancyApp",
  user: process.env.PGUSER || process.env.USER, // your mac username usually works
  password: process.env.PGPASSWORD || undefined, // if you have one
  // ssl: { rejectUnauthorized: false }, // uncomment if you use a hosted DB that requires SSL
});

module.exports = pool;
