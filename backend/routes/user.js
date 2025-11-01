const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { xacThuc } = require('../middleware/auth');
const { kiemTraQuyenAdmin, kiemTraQuyenXoaUser, kiemTraQuyenSuaUser, checkRole } = require('../middleware/rbac');

// Lấy danh sách user
// Admin: xem tất cả user
// Moderator: chỉ xem user thường
router.get('/', xacThuc, checkRole('admin', 'moderator'), async (req, res) => {
  try {
    console.log(`🔍 ${req.userInfo.role === 'admin' ? 'Admin' : 'Moderator'} đang xem danh sách user:`, req.userInfo.email);
    
    let users;
    if (req.userInfo.role === 'admin') {
      // Admin xem tất cả user
      users = await User.find().select('-password').sort({ createdAt: -1 });
    } else {
      // Moderator chỉ xem user thường
      users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    }
    
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

// Cập nhật user theo id (Admin hoặc Moderator sửa user thường, hoặc tự sửa)
router.put('/:id', xacThuc, kiemTraQuyenSuaUser, async (req, res) => {
  try {
    console.log(`📩 PUT /users/:id bởi ${req.userInfo.role}:`, req.userInfo.email);
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
    ).select('-password');

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

// ============= ADVANCED RBAC APIs =============

// Cập nhật role của user (chỉ Admin)
// PATCH /users/:id/role
router.patch('/:id/role', xacThuc, checkRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role) {
      return res.status(400).json({ message: 'Role là bắt buộc' });
    }

    if (!['user', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({ 
        message: 'Role không hợp lệ. Chỉ chấp nhận: user, admin, moderator' 
      });
    }

    // Tìm user
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Admin không thể đổi role của chính mình
    if (req.userInfo._id.toString() === id) {
      return res.status(400).json({ 
        message: 'Admin không thể thay đổi role của chính mình' 
      });
    }

    // Cập nhật role
    userToUpdate.role = role;
    await userToUpdate.save();

    console.log(`✅ Đã cập nhật role của user ${userToUpdate.email} thành ${role} bởi ${req.userInfo.email}`);

    return res.json({ 
      message: 'Cập nhật role thành công',
      user: {
        id: userToUpdate._id,
        name: userToUpdate.name,
        email: userToUpdate.email,
        role: userToUpdate.role
      }
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật role:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật role' });
  }
});

// Lấy danh sách users có quyền admin hoặc moderator (chỉ Admin)
// GET /users/admins
router.get('/admins', xacThuc, checkRole('admin'), async (req, res) => {
  try {
    console.log('🔍 Lấy danh sách admins/moderators bởi:', req.userInfo.email);
    const admins = await User.find({ role: { $in: ['admin', 'moderator'] } })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      message: 'Lấy danh sách admins/moderators thành công',
      users: admins,
      total: admins.length
    });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách admins:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách admins' });
  }
});

module.exports = router;
