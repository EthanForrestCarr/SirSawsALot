-- Connect to the target database
\connect sirsawsalot

-- Create users table
DROP TABLE IF EXISTS users CASCADE;  -- Drop table to reset schema

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,  -- Correctly replaces contact_info
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create requests table
DROP TABLE IF EXISTS requests CASCADE;  -- Drop table to reset schema

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    images TEXT[],
    wood_keep BOOLEAN DEFAULT false,
    wood_arrangement TEXT,
    stump_grinding BOOLEAN DEFAULT false,
    branch_height INTEGER,
    status TEXT DEFAULT 'pending',
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS unavailable_dates (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    reason TEXT DEFAULT 'Fully booked' -- Optional: Let Jonah specify a reason
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- For registered users
    guest_email TEXT, -- For guests (optional)
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE, -- Tracks whether notification is read
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create the invoices table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    request_id INT REFERENCES requests(id) ON DELETE CASCADE, -- Link to work request
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    work_description TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL, -- Store the invoice amount
    due_date DATE NOT NULL, -- When payment is due
    status TEXT CHECK (status IN ('unpaid', 'paid', 'canceled')) DEFAULT 'unpaid',
    notes TEXT, -- Optional field for extra details
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX idx_invoices_request_id ON invoices(request_id);
CREATE INDEX idx_invoices_status ON invoices(status);
