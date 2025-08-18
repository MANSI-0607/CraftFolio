const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getUserPortfolio,
  updatePortfolio,
  getPublicPortfolio,
} = require('../controllers/portfolioController');

// Private routes (logged-in user)
router.get('/', auth, getUserPortfolio);
router.put('/', auth, updatePortfolio);

// Public route (no login required)
router.get('/public/:username', getPublicPortfolio);

module.exports = router;
