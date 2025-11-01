const cloudinary = require('cloudinary').v2;
const User = require('../models/user');

// Cấu hình Cloudinary
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('❌ Thiếu cấu hình Cloudinary trong biến môi trường .env', {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: CLOUDINARY_API_KEY ? CLOUDINARY_API_KEY.slice(0, 4) + '***' : undefined,
    CLOUDINARY_API_SECRET: CLOUDINARY_API_SECRET ? '***' : undefined
  });
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

// Upload avatar lên Cloudinary
const taiLenAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh để upload'
      });
    }

    const userId = req.user.userId || req.user.id || req.user._id;

    console.log('📸 UPLOAD AVATAR:');
    console.log('User ID:', userId);
    console.log('User object:', req.user);
    console.log('File:', req.file);
    console.log('==========================================');

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    // Kiểm tra xem có cấu hình Cloudinary không
    let avatarUrl;
    
    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
      // Upload lên Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'group05-avatars',
        transformation: [
          { width: 300, height: 300, crop: 'fill', gravity: 'face' },
          { quality: 'auto' }
        ]
      });
      avatarUrl = result.secure_url;
      
      // Xóa file tạm sau khi upload lên Cloudinary
      const fs = require('fs');
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.warn('⚠️  Không thể xóa file tạm, bỏ qua:', unlinkErr?.message);
      }
    } else {
      // Sử dụng URL local nếu không có Cloudinary
      console.log('⚠️  Cloudinary chưa được cấu hình, sử dụng avatar local');
      // Tạo URL local: http://localhost:3000/uploads/avatar-xxx.jpg
      const fileName = req.file.filename;
      avatarUrl = `http://localhost:3000/uploads/${fileName}`;
    }

    // Cập nhật avatar URL trong database
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Upload avatar thành công',
      data: {
        avatar: avatarUrl,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          age: user.age,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Lỗi upload avatar:', error);
    
    // Xóa file tạm nếu có lỗi
    if (req.file) {
      const fs = require('fs');
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Lỗi xóa file tạm:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi upload avatar. Vui lòng thử lại sau.',
      detail: error?.message || undefined
    });
  }
};

// Xóa avatar (đặt về mặc định)
const xoaAvatar = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;

    // Cập nhật avatar về rỗng
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: '' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Đã xóa avatar thành công',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        }
      }
    });

  } catch (error) {
    console.error('Lỗi xóa avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

module.exports = {
  taiLenAvatar,
  xoaAvatar
};
