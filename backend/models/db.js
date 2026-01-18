// backend/models/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:2004@localhost:5432/campus_connect'
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to PostgreSQL:', err.stack);
  }
  console.log('PostgreSQL connected successfully!');
  release();
});

module.exports = pool;