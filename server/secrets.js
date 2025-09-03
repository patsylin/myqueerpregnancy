require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "dev-cookie";

module.exports = { JWT_SECRET, COOKIE_SECRET };
