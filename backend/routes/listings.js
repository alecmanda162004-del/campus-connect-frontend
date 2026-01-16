// backend/routes/listings.js
const express = require('express');
const router = express.Router();

// Dummy listings data (we'll replace with real DB later)
const dummyListings = [
  {
    id: 1,
    title: "iPhone 12 - 128GB",
    price: 4500,
    description: "Excellent condition, battery health 92%. Perfect for UNILUS students.",
    condition: "Used - Excellent",
    sellerPhone: "260977123456",
    imageUrl: "https://via.placeholder.com/400x300?text=iPhone"
  },
  {
    id: 2,
    title: "Engineering Textbooks - Year 1",
    price: 800,
    description: "Almost new, no markings. Set of 4 books.",
    condition: "New",
    sellerPhone: "260955987654",
    imageUrl: "https://via.placeholder.com/400x300?text=Books"
  }
];

// GET all listings (for Marketplace page)
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    count: dummyListings.length,
    data: dummyListings
  });
});

module.exports = router;