-- Add missing columns to nipt_patients for Westesti logic
ALTER TABLE nipt_patients
ADD COLUMN gestational_age VARCHAR(20),
ADD COLUMN maternal_age INT,
ADD COLUMN weight DECIMAL(5,2),
ADD COLUMN height DECIMAL(5,2),
ADD COLUMN doctor_name VARCHAR(100);
