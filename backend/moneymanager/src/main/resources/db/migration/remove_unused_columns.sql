-- Migration script to remove unused columns from database
-- Date: 2025-12-05
-- Description: Remove profile_image, notification_enabled from users table
--              Remove emoji from incomes and expenses tables

USE moneymanager;

-- Drop column from users table
ALTER TABLE users DROP COLUMN IF EXISTS profile_image;
ALTER TABLE users DROP COLUMN IF EXISTS notification_enabled;

-- Drop column from incomes table
ALTER TABLE incomes DROP COLUMN IF EXISTS emoji;

-- Drop column from expenses table
ALTER TABLE expenses DROP COLUMN IF EXISTS emoji;

-- Verify columns are removed
SHOW COLUMNS FROM users;
SHOW COLUMNS FROM incomes;
SHOW COLUMNS FROM expenses;
