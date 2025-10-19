const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { xacThuc } = require('../middleware/auth');
const { kiemTraQuyenAdmin, kiemTraQuyenXoaUser } = require('../middleware/rbac');

// Lấy danh sách user (chỉ Admin)
router.get('/', xacThuc, kiemTraQuyenAdmin, async (req, res) => {
  try {
    console.log('🔍 Admin đang xem danh sách user:', req.userInfo.email);
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      message: 'Lấy danh sách user thành công',
      users: users,
      total: users.length
    });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách user:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách user' });
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

// Xóa user theo id (Admin hoặc tự xóa)
router.delete('/:id', xacThuc, kiemTraQuyenXoaUser, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Xóa user với ID:', id, 'bởi:', req.userInfo.email);
    
    // Tìm user cần xóa
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'Không tìm thấy user để xóa' });
    }

    // Admin không thể xóa chính mình
    if (req.userInfo.role === 'admin' && req.userInfo._id.toString() === id) {
      return res.status(400).json({ 
        message: 'Admin không thể xóa tài khoản của chính mình' 
      });
    }

    // Thực hiện xóa
    const deleted = await User.findByIdAndDelete(id);
    console.log('✅ Đã xóa user:', deleted.email);
    
    return res.json({ 
      message: 'Xóa user thành công', 
      deletedUser: {
        id: deleted._id,
        name: deleted.name,
        email: deleted.email,
        role: deleted.role
      }
    });
  } catch (err) {
    console.error('Lỗi khi xóa user:', err);
    res.status(500).json({ message: 'Lỗi server khi xóa user' });
  }
});

module.exports = router;
