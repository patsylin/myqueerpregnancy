// server/db/index.js
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser()); // <-- UNSIGNED cookies
app.use("/api", require("./api/index.js"));

// Prefer DATABASE_URL if provided (e.g. in .env)
const connectionString = process.env.DATABASE_URL;

let pool;
if (connectionString) {
  pool = new Pool({ connectionString });
  console.log("[DB] Connecting with DATABASE_URL:", connectionString);
} else {
  pool = new Pool({
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE || "queerPregnancyApp",
    user: process.env.PGUSER || process.env.USER, // Mac username fallback
    password: process.env.PGPASSWORD || undefined,
    // ssl: { rejectUnauthorized: false }, // Uncomment for hosted DBs
  });
  console.log("[DB] Connecting with local defaults:", {
    host: pool.options.host,
    port: pool.options.port,
    database: pool.options.database,
    user: pool.options.user,
  });
}

module.exports = pool;
