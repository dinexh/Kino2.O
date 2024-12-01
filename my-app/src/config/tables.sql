CREATE DATABASE chitramela;
USE chitramela;

-- Creating the `users` table first for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,    -- Username for login
    email VARCHAR(255) UNIQUE NOT NULL,       -- Email for login
    password VARCHAR(255) NOT NULL,           -- Encrypted password
    role ENUM('SuperAdmin', 'Admin', 'User') NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modify the password column to accommodate longer hashed passwords
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL;

-- Creating the `college_ids` table to store ID card files
CREATE TABLE college_ids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_number VARCHAR(100) UNIQUE NOT NULL,    -- College ID number
    original_filename VARCHAR(255) NOT NULL,    -- Original name of uploaded file
    stored_filename VARCHAR(255) NOT NULL,      -- Name of file in our storage
    file_path VARCHAR(255) NOT NULL,           -- Full path where file is stored
    file_size INT NOT NULL,                    -- Size of file in bytes
    mime_type VARCHAR(100) NOT NULL,           -- MIME type of file (e.g., image/jpeg)
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(255),                  -- Admin who verified the ID
    verification_date TIMESTAMP NULL,          -- When the ID was verified
    verification_notes TEXT,                   -- Any notes from verification
    form_link VARCHAR(255) NOT NULL DEFAULT '',
    FOREIGN KEY (verified_by) REFERENCES users(username)
);

-- Creating the `registrations` table with references to users
CREATE TABLE registrations (
    id_number VARCHAR(100) PRIMARY KEY,       -- College ID number (unique)
    username VARCHAR(255) NOT NULL,           -- Reference to users table
    email VARCHAR(255) NOT NULL,              -- Reference to users table
    phone VARCHAR(15) UNIQUE NOT NULL,        -- User phone number
    college VARCHAR(255) NOT NULL,            -- College name
    gender ENUM('Male', 'Female', 'Other'),   -- Gender of the user
    registration_status ENUM('Pending', 'Confirmed') DEFAULT 'Pending',
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (id_number) REFERENCES college_ids(id_number) ON DELETE CASCADE
);

-- Creating the `events` table
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE,
    event_time TIME,
    venue VARCHAR(255),
    rules TEXT,
    schedule TEXT,
    created_by VARCHAR(255),                  -- Reference to admin who created the event
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(username)
);

-- Creating the `event_registrations` table
CREATE TABLE event_registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    id_number VARCHAR(100),                    -- College ID from registrations
    event_id INT,                             -- Event ID from events table
    registration_status ENUM('Pending', 'Confirmed') DEFAULT 'Pending',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_number) REFERENCES registrations(id_number) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- Creating the `payments` table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    id_number VARCHAR(100),                    -- College ID from registrations
    event_id INT,                             -- Event ID from events table
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    transaction_id VARCHAR(255) UNIQUE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by VARCHAR(255),                  -- Reference to admin who verified the payment
    FOREIGN KEY (id_number) REFERENCES registrations(id_number) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(username)
);

-- Creating the `help_requests` table
CREATE TABLE help_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    id_number VARCHAR(100),                    -- College ID from registrations
    issue_description TEXT NOT NULL,
    status ENUM('Open', 'InProgress', 'Resolved') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    handled_by VARCHAR(255),                   -- Reference to admin handling the request
    resolution_notes TEXT,
    FOREIGN KEY (id_number) REFERENCES registrations(id_number) ON DELETE CASCADE,
    FOREIGN KEY (handled_by) REFERENCES users(username)
);

-- Update only the role ENUM to include 'User'
ALTER TABLE users 
    MODIFY COLUMN role ENUM('SuperAdmin', 'Admin', 'User') NOT NULL;



