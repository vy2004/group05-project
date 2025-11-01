const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
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
    let resizedFilePath = null;
    
    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
      // Sử dụng Sharp để resize ảnh trước khi upload lên Cloudinary
      const resizedFileName = `avatar-resized-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
      resizedFilePath = path.join('uploads', resizedFileName);
      
      try {
        // Resize ảnh về 300x300px với crop fill và tối ưu chất lượng
        await sharp(req.file.path)
          .resize(300, 300, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 85, mozjpeg: true })
          .toFile(resizedFilePath);
        
        console.log('✅ Đã resize ảnh thành công:', resizedFilePath);
        
        // Upload ảnh đã resize lên Cloudinary
        const result = await cloudinary.uploader.upload(resizedFilePath, {
          folder: 'group05-avatars',
          transformation: [
            { quality: 'auto' }
          ]
        });
        avatarUrl = result.secure_url;
        
        console.log('✅ Đã upload lên Cloudinary:', avatarUrl);
        
        // Xóa file tạm sau khi upload lên Cloudinary
        try {
          fs.unlinkSync(req.file.path);
          if (resizedFilePath && fs.existsSync(resizedFilePath)) {
            fs.unlinkSync(resizedFilePath);
          }
        } catch (unlinkErr) {
          console.warn('⚠️  Không thể xóa file tạm, bỏ qua:', unlinkErr?.message);
        }
      } catch (sharpError) {
        console.error('❌ Lỗi khi resize ảnh với Sharp:', sharpError);
        // Fallback: upload file gốc nếu Sharp lỗi
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'group05-avatars',
          transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
          ]
        });
        avatarUrl = result.secure_url;
        
        // Xóa file tạm
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          console.warn('⚠️  Không thể xóa file tạm, bỏ qua:', unlinkErr?.message);
        }
      }
    } else {
      // Sử dụng Sharp resize và lưu local nếu không có Cloudinary
      console.log('⚠️  Cloudinary chưa được cấu hình, sử dụng avatar local');
      
      try {
        const resizedFileName = `avatar-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
        resizedFilePath = path.join('uploads', resizedFileName);
        
        await sharp(req.file.path)
          .resize(300, 300, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 85, mozjpeg: true })
          .toFile(resizedFilePath);
        
        // Xóa file gốc
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          console.warn('⚠️  Không thể xóa file gốc, bỏ qua:', unlinkErr?.message);
        }
        
        avatarUrl = `http://localhost:3000/uploads/${resizedFileName}`;
        console.log('✅ Đã resize và lưu avatar local:', avatarUrl);
      } catch (sharpError) {
        console.error('❌ Lỗi khi resize ảnh với Sharp:', sharpError);
        // Fallback: sử dụng file gốc
        const fileName = req.file.filename;
        avatarUrl = `http://localhost:3000/uploads/${fileName}`;
      }
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
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Lỗi xóa file tạm:', unlinkError);
      }
    }
    
    // Xóa file đã resize nếu có
    if (resizedFilePath && fs.existsSync(resizedFilePath)) {
      try {
        fs.unlinkSync(resizedFilePath);
      } catch (unlinkError) {
        console.error('Lỗi xóa file đã resize:', unlinkError);
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
