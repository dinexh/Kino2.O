-- DO NOT use these direct password inserts anymore
-- Instead, use the script below to create users with hashed passwords

-- Replace 'YOUR_GENERATED_HASH' with the actual hash from the script
INSERT INTO users (username, email, password, role, active)
VALUES ('Dinesh', 'dinesh@chitramela.com', '$2a$10$KGItzM35ciBzKvz8uOTz8u2k8d0X4htscmFAxz8wx17ftmKfACUqG', 'SuperAdmin', TRUE);

INSERT INTO users (username, email, password, role, active)
VALUES ('Karthik', 'karthik@chitramela.com', '$2a$10$KGItzM35ciBzKvz8uOTz8u2k8d0X4htscmFAxz8wx17ftmKfACUqG', 'Admin', TRUE);