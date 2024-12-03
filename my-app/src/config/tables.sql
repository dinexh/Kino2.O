CREATE DATABASE chitramela;
USE chitramela;

-- Creating the `users` table first for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,    -- College ID as username
    email VARCHAR(255) UNIQUE NOT NULL,       
    password VARCHAR(255) NOT NULL,           
    role ENUM('SuperAdmin', 'Admin', 'RegisteredUser') NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for event registrations (linked to users table)
CREATE TABLE event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                    -- Link to users table
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    id_number VARCHAR(50) NOT NULL,          -- College ID
    phone_number VARCHAR(20) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    college VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    referral_name VARCHAR(255),
    id_card_upload_link TEXT NOT NULL,
    registration_status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_registration (email, id_number)
);

-- Table for storing selected events for each registration
CREATE TABLE registration_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (registration_id) REFERENCES event_registrations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for payment tracking
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL,
    student_id VARCHAR(50) NOT NULL,        -- ID Number
    email VARCHAR(255) NOT NULL,            -- Email
    payment_id VARCHAR(255) NOT NULL,       -- Payment ID
    amount DECIMAL(10,2) DEFAULT 250.00,    -- Fixed amount of 250 INR
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    verified_by INT,                        -- Admin who verified the payment
    verification_date TIMESTAMP NULL,       -- When payment was verified
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES event_registrations(id),
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

