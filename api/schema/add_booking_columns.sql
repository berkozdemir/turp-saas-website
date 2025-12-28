-- Add test_type to nipt_bookings for unified testing logic
ALTER TABLE nipt_bookings
ADD COLUMN test_type VARCHAR(50) DEFAULT 'verifi';
