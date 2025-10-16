// routes/user.js
const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');

// ✅ Định nghĩa các route
router.get('/', getUsers);
router.post('/', createUser);

module.exports = router;

