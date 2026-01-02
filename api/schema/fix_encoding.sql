-- Fix Turkish character encoding for doctors table
-- Run this SQL to ensure proper UTF-8 support

-- 1. Convert doctors table to utf8mb4
ALTER TABLE `doctors` 
CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Specifically update text columns
ALTER TABLE `doctors`
MODIFY `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
MODIFY `city` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
MODIFY `clinic` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
MODIFY `notes` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Also ensure endusers table has proper encoding
ALTER TABLE `endusers`
CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Verify encoding
SHOW CREATE TABLE doctors;
