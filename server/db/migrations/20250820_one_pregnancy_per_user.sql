-- 1. enforce one pregnancy per user
ALTER TABLE pregnancies
  ADD CONSTRAINT IF NOT EXISTS pregnancies_user_unique UNIQUE (user_id);

-- 2. backfill journal_entries.week from the user's pregnancy due_date
UPDATE journal_entries j
SET week = gestational_week_from_due_date(p.due_date)
FROM pregnancies p
WHERE p.user_id = j.user_id
  AND j.week IS NULL;

-- 3. sanity: index on journal_entries.week
CREATE INDEX IF NOT EXISTS journal_entries_week_idx ON journal_entries(week);
