const express = require('express');
const router = express.Router();
const { taiLenAvatar, xoaAvatar } = require('../controllers/avatarController');
const { xacThuc } = require('../middleware/auth');
const multer = require('multer');

// Cấu hình multer để xử lý file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Thư mục tạm để lưu file
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  },
  fileFilter: function (req, file, cb) {
    // Kiểm tra loại file
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file hình ảnh!'), false);
    }
  }
});

// POST /avatar/upload - Upload avatar (cần đăng nhập)
router.post('/upload', xacThuc, upload.single('avatar'), taiLenAvatar);

// DELETE /avatar/remove - Xóa avatar (cần đăng nhập)
router.delete('/remove', xacThuc, xoaAvatar);

module.exports = router;
