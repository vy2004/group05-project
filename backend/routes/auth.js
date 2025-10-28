const express = require('express');
const router = express.Router();
const { signup, login, logout, refresh } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh); // ✅ Endpoint refresh token mới

module.exports = router;
