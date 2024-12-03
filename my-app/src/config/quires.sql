-- DO NOT use these direct password inserts anymore
-- Instead, use the script below to create users with hashed passwords

-- Replace 'YOUR_GENERATED_HASH' with the actual hash from the script
INSERT INTO users (username, email, password, role, active, created_at)
VALUES ('Dinesh', 'dinesh@chitramela.com', '$2a$10$KGItzM35ciBzKvz8uOTz8u2k8d0X4htscmFAxz8wx17ftmKfACUqG', 'SuperAdmin', TRUE, CURRENT_TIMESTAMP);

INSERT INTO users (username, email, password, role, active, created_at)
VALUES ('Karthik', 'karthik@chitramela.com', '$2a$10$KGItzM35ciBzKvz8uOTz8u2k8d0X4htscmFAxz8wx17ftmKfACUqG', 'Admin', TRUE, CURRENT_TIMESTAMP);

-- Demo user with event registration
INSERT INTO users (username, email, password, role, active, created_at)
VALUES ('DemoUser', 'demo@example.com', '$2a$10$KGItzM35ciBzKvz8uOTz8u2k8d0X4htscmFAxz8wx17ftmKfACUqG', 'User', TRUE, CURRENT_TIMESTAMP);

-- Note: Before adding event registration, please ensure you have created the event_registrations table
-- as it's not shown in the provided schema