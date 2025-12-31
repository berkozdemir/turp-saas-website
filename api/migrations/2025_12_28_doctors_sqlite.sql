CREATE TABLE IF NOT EXISTS doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  specialty TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doctors_active ON doctors(is_active);

ALTER TABLE contact_submissions ADD COLUMN home_service INTEGER DEFAULT 0;
ALTER TABLE contact_submissions ADD COLUMN address TEXT;
ALTER TABLE contact_submissions ADD COLUMN pregnancy_week INTEGER;
ALTER TABLE contact_submissions ADD COLUMN has_doctor INTEGER DEFAULT 0;
ALTER TABLE contact_submissions ADD COLUMN doctor_id INTEGER;
ALTER TABLE contact_submissions ADD COLUMN doctor_name TEXT;
ALTER TABLE contact_submissions ADD COLUMN pricing_tier TEXT DEFAULT 'direct';
