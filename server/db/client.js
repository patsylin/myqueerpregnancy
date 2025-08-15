// Require Client from pg
const { Client } = require("pg");

//Establishing connect to database (like how we do with http://)
const dbName = "queerPregnancyApp";
const client = new Client(
  process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
);

//Export for use in other files
module.exports = client;
