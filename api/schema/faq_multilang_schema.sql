-- FAQ Table Schema Update for Multilingual Support
-- Run this SQL on the database to add translation columns

ALTER TABLE faqs
ADD COLUMN question_en VARCHAR(500) NULL AFTER question,
ADD COLUMN question_zh VARCHAR(500) NULL AFTER question_en,
ADD COLUMN answer_en TEXT NULL AFTER answer,
ADD COLUMN answer_zh TEXT NULL AFTER answer_en;

-- Rename original columns for clarity (optional - if you want to rename)
-- ALTER TABLE faqs CHANGE question question_tr VARCHAR(500) NOT NULL;
-- ALTER TABLE faqs CHANGE answer answer_tr TEXT NOT NULL;
