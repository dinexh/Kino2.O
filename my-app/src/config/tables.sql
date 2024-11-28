CREATE DATABASE chitramela;
USE chitramela;

-- Creating the `users` table first
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,        -- Unique identifier
    username VARCHAR(255) UNIQUE NOT NULL,    -- Username (also used as name)
    password VARCHAR(255) NOT NULL,           -- Encrypted password or plaintext
    role ENUM('Admin', 'Administrative', 'User') NOT NULL, -- Role of the user
    active BOOLEAN DEFAULT TRUE,              -- Whether the account is active
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Account creation timestamp
);

-- Creating the `registrations` table after `users`
CREATE TABLE registrations (
    id_number VARCHAR(100) PRIMARY KEY,       -- College ID number (unique)
    username VARCHAR(255) NOT NULL,           -- Username from `users` table
    email VARCHAR(255) UNIQUE NOT NULL,       -- User email (must be unique)
    phone VARCHAR(15) NOT NULL,               -- User phone number
    college VARCHAR(255) NOT NULL,            -- College name
    college_idcard VARCHAR(255),              -- Path to uploaded ID card
    gender ENUM('Male', 'Female', 'Other'),   -- Gender of the user
    referral VARCHAR(255),                    -- Referral ID or reference
    registration_status ENUM('Pending', 'Confirmed') DEFAULT 'Pending', -- Registration status
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

-- Creating the `payments` table after both `registrations` and `users`
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique payment ID
    id_number VARCHAR(100),                    -- College ID number (foreign key from registrations)
    amount DECIMAL(10, 2) NOT NULL,            -- Payment amount
    payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending', -- Payment status
    transaction_id VARCHAR(255) UNIQUE,        -- Unique transaction ID
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Payment date
    FOREIGN KEY (id_number) REFERENCES registrations(id_number) ON DELETE CASCADE
);

-- Creating the `help_requests` table after `registrations` and `users`
CREATE TABLE help_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique request ID
    id_number VARCHAR(100),                    -- College ID number (foreign key from registrations)
    issue_description TEXT NOT NULL,           -- Description of the issue
    status ENUM('Open', 'Resolved') DEFAULT 'Open', -- Status of the request
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date and time of the request
    resolved_at TIMESTAMP NULL,                -- Date and time when resolved
    FOREIGN KEY (id_number) REFERENCES registrations(id_number) ON DELETE CASCADE
);



