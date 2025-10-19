const express = require('express');
const router = express.Router();
const { xacThuc } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

// @route   GET /profile
// @desc    Get user profile
// @access  Private
router.get('/', xacThuc, profileController.getProfile);

// @route   PUT /profile
// @desc    Update user profile
// @access  Private
router.put('/', xacThuc, profileController.updateProfile);

module.exports = router;