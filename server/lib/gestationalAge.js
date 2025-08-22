function gestationalAgeFromDueDate(dueDateISO) {
  const today = new Date();
  const due = new Date(dueDateISO);
  const MS = 24 * 60 * 60 * 1000;
  const daysUntilDue = Math.ceil((due - today) / MS);
  const totalDays = Math.max(0, Math.min(280, 280 - daysUntilDue));
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  return { weeks, days, totalDays, category: weeks };
}
module.exports = { gestationalAgeFromDueDate };
