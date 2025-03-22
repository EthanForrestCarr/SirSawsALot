-- Connect to the target database
\connect sirsawsalot

-- Create users table
DROP TABLE IF EXISTS users CASCADE;  -- Drop table to reset schema

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create requests table
DROP TABLE IF EXISTS requests CASCADE;  -- Drop table to reset schema

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    images BYTEA, -- Changed from TEXT[] to BYTEA for binary storage
    wood_keep BOOLEAN DEFAULT false,
    wood_arrangement TEXT,
    stump_grinding BOOLEAN DEFAULT false,
    branch_height INTEGER,
    status TEXT DEFAULT 'pending',
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS unavailable_dates CASCADE;  -- Drop table to reset schema

CREATE TABLE IF NOT EXISTS unavailable_dates (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    reason TEXT DEFAULT 'Fully booked' -- Optional: Let Jonah specify a reason
);

DROP TABLE IF EXISTS notifications CASCADE;  -- Drop table to reset schema

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- For registered users
    guest_email TEXT, -- For guests (optional)
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE, -- Tracks whether notification is read
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create the invoices table
DROP TABLE IF EXISTS invoices;

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  request_id INTEGER,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  address TEXT NOT NULL,
  customer_description TEXT NOT NULL,  -- renamed field
  wood_keep BOOLEAN NOT NULL,            -- new field for wood keep
  stump_grinding BOOLEAN NOT NULL,       -- new field for stump grinding
  total_amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- (Optional) Create indexes for faster lookups
CREATE INDEX idx_invoices_request_id ON invoices(request_id);
CREATE INDEX idx_invoices_status ON invoices((CASE WHEN notes IS NULL THEN 'pending' ELSE notes END));  -- Adjust accordingly if you add a status column
