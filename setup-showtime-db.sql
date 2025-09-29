-- Create database for showtime service
CREATE DATABASE IF NOT EXISTS showtime_service_db;

-- Create user for showtime service
CREATE USER IF NOT EXISTS 'showtime_service'@'localhost' IDENTIFIED BY 'showtime_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON showtime_service_db.* TO 'showtime_service'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show databases to verify
SHOW DATABASES;