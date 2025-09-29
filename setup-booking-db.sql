-- Create database for booking service
CREATE DATABASE IF NOT EXISTS booking_service_db;

-- Create user for booking service
CREATE USER IF NOT EXISTS 'booking_service'@'localhost' IDENTIFIED BY 'bookingpassword';

-- Grant privileges
GRANT ALL PRIVILEGES ON booking_service_db.* TO 'booking_service'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Use the booking service database
USE booking_service_db;

-- Create the bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    showtime_id BIGINT NOT NULL,
    number_of_seats INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('CONFIRMED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'CONFIRMED',
    booking_reference VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_showtime_id (showtime_id),
    INDEX idx_booking_reference (booking_reference),
    INDEX idx_status (status)
);

-- Show table structure
DESCRIBE bookings;