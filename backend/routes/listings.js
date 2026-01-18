// backend/routes/listings.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');  // Import the DB pool

// GET all approved listings (for Marketplace page)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        title, 
        description, 
        price, 
        condition, 
        whatsapp_phone, 
        image_url, 
        status,
        created_at
      FROM listings 
      WHERE status = 'approved'
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      status: 'success',
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch listings from database'
    });
  }
});

module.exports = router;