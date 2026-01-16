// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const healthRouter = require('./routes/health');  // ← new import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);  // ← use the router

// Basic root route
app.get('/', (req, res) => {
  res.send('Hello from Campus-Connect backend! 🚀');
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});