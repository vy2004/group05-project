const express = require('express');
const router = express.Router();
const User = require('../models/User');
// Lấy danh sách user
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Thêm user mới
router.post('/', async (req, res) => {
  try {
    console.log("📩 Dữ liệu nhận từ Postman:", req.body);

    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: 'name và email là bắt buộc' });

    const newUser = new User({ name, email });
    const savedUser = await newUser.save(); // ✅ Lưu thật vào MongoDB
    res.status(201).json(savedUser);        // ✅ Trả về document thật
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
