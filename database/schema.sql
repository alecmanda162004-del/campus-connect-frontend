-- database/schema.sql
-- Users table (for authentication, roles, subscription)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- We'll use bcrypt
    role VARCHAR(20) DEFAULT 'user',      -- 'user' or 'admin'
    subscription_status BOOLEAN DEFAULT FALSE,
    subscription_expiry DATE,
    whatsapp_phone VARCHAR(15),           -- e.g., '260977123456'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings table (marketplace items)
CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    condition VARCHAR(50) DEFAULT 'Used - Good',
    image_url VARCHAR(255),
    whatsapp_phone VARCHAR(15),           -- Seller's WhatsApp (can override user's)
    status VARCHAR(20) DEFAULT 'pending', -- pending / approved / rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Simple index for faster searches
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_user_id ON listings(user_id);