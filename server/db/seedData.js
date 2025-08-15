const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const hashPasswords = async () => {
  const users = [
    {
      username: "Gustavo",
      password: await bcrypt.hash("12345678", SALT_ROUNDS),
      journal: "funny",
    },
    {
      username: "Kieran",
      password: await bcrypt.hash("87654321", SALT_ROUNDS),
      journal: "smiley",
    },
    {
      username: "Patsy",
      password: await bcrypt.hash("12", SALT_ROUNDS),
      journal: "happy",
    },
  ];

  const pregnancies = [
    { user_id: 1, age: 7, is_tracking: true },
    { user_id: 2, age: 12, is_tracking: true },
    { user_id: 3, age: 15, is_tracking: true },
  ];

  const weeks = [
    {
      weight: 0.04,
      size: 0.31,
      info: "Baby is the size of an eyeliner brush",
    },
    {
      weight: 0.49,
      size: 2.1,
      info: "Baby is the size of a golden snitch",
    },
    {
      weight: 2.47,
      size: 3.98,
      info: "Baby is the size of a mixtape",
    },
  ];

  const pregnancyWeeks = [
    { week_id: 1, preg_id: 1 },
    { week_id: 2, preg_id: 2 },
    { week_id: 3, preg_id: 3 },
  ];

  const journalEntries = [
    { user_id: 1, content: "First entry" },
    { user_id: 2, content: "Excited to start this journey" },
    { user_id: 3, content: "Feeling great today" },
  ];

  return { users, pregnancies, weeks, pregnancyWeeks, journalEntries };
};

module.exports = hashPasswords;
