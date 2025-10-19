const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');

// @route   GET /profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, profileController.getProfile);

// @route   PUT /profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, profileController.updateProfile);

module.exports = router;