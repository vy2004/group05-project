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
    console.log("📩 Dữ liệu nhận từ client:", req.body);

    const { name, email, age } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'name và email là bắt buộc' });
    }

    // Ép kiểu age và kiểm tra
    const ageNum = (age === "" || age === undefined || age === null) ? undefined : Number(age);
    if (ageNum === undefined || Number.isNaN(ageNum)) {
      return res.status(400).json({ message: 'Tuổi là bắt buộc và phải là số' });
    }

    const newUser = new User({ name, email, age: ageNum });
    const savedUser = await newUser.save(); // ✅ Lưu vào MongoDB
    res.status(201).json(savedUser);        // ✅ Trả về document
  } catch (err) {
    console.error("Lỗi khi thêm user:", err);
    // trả lỗi chi tiết nếu là validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    console.log('📩 PUT /users/:id params:', req.params);
    console.log('📩 PUT /users/:id body:', req.body);

    const { id } = req.params;
    const { name, email, age } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'name và email là bắt buộc' });
    }

    const ageNum = (age === "" || age === undefined || age === null) ? undefined : Number(age);
    if (ageNum === undefined || Number.isNaN(ageNum)) {
      return res.status(400).json({ message: 'Tuổi là bắt buộc và phải là số' });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { name, email, age: ageNum },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'User không tồn tại' });
    return res.json({ message: 'Cập nhật thành công', user: updated });
  } catch (err) {
    console.error('Lỗi khi cập nhật user:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
});

// Xóa user theo id
router.delete('/:id', async (req, res) => {
  try {
    console.log('📩 DELETE /users/:id params:', req.params); // debug xem id
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User không tồn tại' });
    return res.json({ message: 'Xóa thành công', user: deleted });
  } catch (err) {
    console.error('Lỗi khi xóa user:', err);
    res.status(500).json({ message: err.message });
  }
  
}
);
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ URL
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true, // Trả về document sau khi cập nhật
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user!" });
    }

    res.json({
      message: "Cập nhật user thành công!",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
