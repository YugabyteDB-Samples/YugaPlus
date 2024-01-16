DROP TABLE IF EXISTS user_account CASCADE;

CREATE TABLE user_account (
    id uuid PRIMARY KEY,
    email text NOT NULL,
    hashed_password text NOT NULL,
    full_name text NOT NULL,
    user_location text
);

INSERT INTO user_account (id, email, hashed_password, full_name, user_location) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'user1@gmail.com', 'password', 'John Doe', 'New York'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'user2@gmail.com', 'password', 'Emely Smith', 'San Francisco'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'user3@gmail.com', 'password', 'Michael Williams', 'Los Angeles'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'user4@gmail.com', 'password', 'Jessica Brown', 'Boston');

