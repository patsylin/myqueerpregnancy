// server/lib/gestationalAge.js

/**
 * Given a due date (YYYY-MM-DD or ISO string), calculate gestational age.
 * Returns weeks, days, totalDays, and category (same as weeks).
 */
function gestationalAgeFromDueDate(dueDateISO) {
  const today = new Date();
  const due = new Date(dueDateISO);
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  // Full-term = 280 days (40 weeks)
  const daysUntilDue = Math.ceil((due - today) / MS_PER_DAY);
  const totalDays = Math.max(0, Math.min(280, 280 - daysUntilDue));

  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;

  return { weeks, days, totalDays, category: weeks };
}

module.exports = { gestationalAgeFromDueDate };
