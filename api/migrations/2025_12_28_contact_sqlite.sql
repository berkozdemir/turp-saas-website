CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  home_service INTEGER DEFAULT 0,
  address TEXT,
  pregnancy_week INTEGER,
  has_doctor INTEGER DEFAULT 0,
  doctor_id INTEGER,
  doctor_name TEXT,
  pricing_tier TEXT DEFAULT 'direct',
  message TEXT,
  read_status INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE INDEX IF NOT EXISTS idx_contact_pricing_tier ON contact_submissions(pricing_tier);
CREATE INDEX IF NOT EXISTS idx_contact_has_doctor ON contact_submissions(has_doctor);
CREATE INDEX IF NOT EXISTS idx_contact_tenant_created ON contact_submissions(tenant_id, created_at DESC);
