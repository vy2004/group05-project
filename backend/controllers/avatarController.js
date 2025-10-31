const cloudinary = require('cloudinary').v2;
const User = require('../models/user');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret'
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

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'group05-avatars',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    });

    // Cập nhật avatar URL trong database
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Xóa file tạm
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: 'Upload avatar thành công',
      data: {
        avatar: result.secure_url,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
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
      message: 'Lỗi server khi upload avatar. Vui lòng thử lại sau.'
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
