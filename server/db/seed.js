const client = require("./client");
const getSeedData = require("./seedData"); // async function now
const { createUser } = require("./helpers/users");
const { createPregnancy } = require("./helpers/pregnancy");
const { createPregnancyWeeks } = require("./helpers/pregnancyWeeks");
const { createWeeks } = require("./helpers/weeks");
const { createJournalEntry } = require("./helpers/journalEntries");

const dropTables = async () => {
  try {
    await client.query(`
        DROP TABLE IF EXISTS pregnancyWeeks;
        DROP TABLE IF EXISTS weeks;
        DROP TABLE IF EXISTS pregnancies;
        DROP TABLE IF EXISTS journal_entries;
        DROP TABLE IF EXISTS users;
    `);
    console.log("Dropped Tables");
  } catch (error) {
    console.log("Error dropping tables");
    throw error;
  }
};

const createTables = async () => {
  await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            journal TEXT
        );
        CREATE TABLE journal_entries(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE pregnancies(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            age INTEGER NOT NULL,
            is_tracking BOOLEAN NOT NULL
        );
        CREATE TABLE weeks(
            id SERIAL PRIMARY KEY,
            weight FLOAT NOT NULL,
            size FLOAT NOT NULL,
            info VARCHAR(255) UNIQUE NOT NULL
        );
        CREATE TABLE pregnancyweeks(
            id SERIAL PRIMARY KEY,
            week_id INTEGER REFERENCES weeks(id),
            preg_id INTEGER REFERENCES pregnancies(id)
        );
    `);
  console.log("Created Tables");
};

const createInitialUsers = async (users) => {
  console.log("Creating Users...");
  for (const user of users) {
    await createUser(user);
  }
};

const createInitialPregnancies = async (pregnancies) => {
  console.log("Creating Pregnancies...");
  for (const pregnancy of pregnancies) {
    await createPregnancy(pregnancy);
  }
};

const createInitialWeeks = async (weeks) => {
  console.log("Creating Weeks...");
  for (const week of weeks) {
    await createWeeks(week);
  }
};

const createInitialPregnancyWeeks = async (pregnancyWeeks) => {
  console.log("Creating Pregnancy Weeks...");
  for (const pw of pregnancyWeeks) {
    await createPregnancyWeeks(pw);
  }
};

const createInitialJournalEntries = async (journalEntries) => {
  console.log("Creating Journal Entries...");
  for (const entry of journalEntries) {
    await createJournalEntry(entry);
  }
};

const initDb = async () => {
  console.log("Initializing DB...");
  try {
    await client.connect();

    const { users, pregnancies, weeks, pregnancyWeeks, journalEntries } =
      await getSeedData(); // wait for hashed passwords

    await dropTables();
    await createTables();
    await createInitialUsers(users);
    await createInitialPregnancies(pregnancies);
    await createInitialWeeks(weeks);
    await createInitialPregnancyWeeks(pregnancyWeeks);
    await createInitialJournalEntries(journalEntries);

    console.log("DB is seeded and ready to go!!");
  } catch (error) {
    console.error("Error during DB initialization:", error);
  } finally {
    client.end();
  }
};

initDb();
