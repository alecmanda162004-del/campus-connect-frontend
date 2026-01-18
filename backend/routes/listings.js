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

// POST new listing (creates with pending status)
router.post('/', async (req, res) => {
  const {
    title,
    description,
    price,
    condition = 'Used - Good',
    whatsapp_phone,
    image_url
  } = req.body;

  // Basic validation
  if (!title || !price || isNaN(price) || price <= 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Title and valid positive price are required'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO listings (
        user_id,
        title,
        description,
        price,
        condition,
        whatsapp_phone,
        image_url,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING id, title, status, created_at`,
      [
        1,  // Hardcoded test user_id=1 (we'll replace with real auth later)
        title,
        description || null,
        price,
        condition,
        whatsapp_phone || null,
        image_url || null
      ]
    );

    const newListing = result.rows[0];

    res.status(201).json({
      status: 'success',
      message: 'Listing created successfully (pending approval)',
      data: newListing
    });
  } catch (err) {
    console.error('Error creating listing:', err.stack);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create listing'
    });
  }
});

module.exports = router;