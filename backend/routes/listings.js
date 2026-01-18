// backend/routes/listings.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET approved listings (with optional limit & offset for pagination)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;      // default 10 items
    const offset = parseInt(req.query.offset) || 0;     // start from 0

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
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.status(200).json({
      status: 'success',
      count: result.rows.length,
      total: (await pool.query('SELECT COUNT(*) FROM listings WHERE status = $1', ['approved'])).rows[0].count,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching listings:', err.stack);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch listings'
    });
  }
});

module.exports = router;