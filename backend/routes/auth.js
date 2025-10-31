const express = require('express');
const router = express.Router();
 feature/refresh-token
const { signup, login, logout, refresh } = require('../controllers/authController');

const { signup, login, logout } = require('../controllers/authController');
 main

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
 feature/refresh-token
router.post('/refresh', refresh); // ✅ Endpoint refresh token mới

 main

module.exports = router;
