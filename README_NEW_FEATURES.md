# Group05 Project - Tính Năng Mới

## 📋 Tổng Quan

Dự án Group05 đã được mở rộng với các tính năng mới:
- **Quên mật khẩu (Forgot Password)** - Gửi token reset qua email
- **Đổi mật khẩu với token reset** - Đặt lại mật khẩu an toàn
- **Upload Avatar với Cloudinary** - Quản lý ảnh đại diện

## 🚀 Tính Năng Đã Triển Khai

### 1. Backend APIs

#### Password Reset APIs:
- `POST /password/forgot` - Gửi email reset mật khẩu
- `POST /password/reset` - Reset mật khẩu với token

#### Avatar Management APIs:
- `POST /avatar/upload` - Upload avatar (cần đăng nhập)
- `DELETE /avatar/remove` - Xóa avatar (cần đăng nhập)

### 2. Frontend Components

#### UI Components:
- `ForgotPassword.jsx` - Form quên mật khẩu
- `ResetPassword.jsx` - Form đặt lại mật khẩu
- `UploadAvatar.jsx` - Component upload avatar

#### Features:
- Gửi email reset mật khẩu
- Đặt lại mật khẩu với token
- Upload/xóa avatar với Cloudinary
- Validation form đầy đủ
- Responsive design

## 📁 Cấu Trúc Files Mới

```
group05-project/
├── backend/
│   ├── controllers/
│   │   ├── passwordController.js     # Xử lý quên/reset password
│   │   └── avatarController.js       # Xử lý upload avatar
│   ├── routes/
│   │   ├── password.js               # Routes cho password reset
│   │   └── avatar.js                 # Routes cho avatar
│   ├── models/
│   │   └── user.js                   # Đã cập nhật thêm avatar, resetToken
│   ├── uploads/                      # Thư mục tạm cho upload
│   ├── Group05_APIs.postman_collection.json  # Postman collection
│   ├── HUONG_DAN_CAU_HINH.md        # Hướng dẫn cấu hình
│   └── HUONG_DAN_TEST_API.md        # Hướng dẫn test API
└── frontend/
    └── src/
        ├── components/
        │   ├── ForgotPassword.jsx    # Form quên mật khẩu
        │   ├── ForgotPassword.css
        │   ├── ResetPassword.jsx     # Form reset mật khẩu
        │   ├── ResetPassword.css
        │   ├── UploadAvatar.jsx      # Component upload avatar
        │   ├── UploadAvatar.css
        │   └── AppContent.jsx        # Main app component với routing
        └── services/
            └── api.js                # Đã cập nhật thêm APIs mới
```

## 🛠️ Cài Đặt Và Chạy

### 1. Backend Setup

```bash
cd backend
npm install cloudinary multer nodemailer crypto
```

### 2. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `backend`:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# JWT Secret
JWT_SECRET=your-jwt-secret-key
```

### 3. Frontend Setup

```bash
cd frontend
npm install react-router-dom
```

### 4. Chạy Ứng Dụng

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📧 Cấu Hình Email (Gmail)

1. Bật 2-Step Verification trong Google Account
2. Tạo App Password cho ứng dụng
3. Sử dụng App Password trong `EMAIL_PASS`

## ☁️ Cấu Hình Cloudinary

1. Tạo tài khoản miễn phí tại [Cloudinary](https://cloudinary.com/)
2. Lấy thông tin API từ Dashboard
3. Cập nhật vào file `.env`

## 🧪 Test APIs

### Import Postman Collection
1. Import file `Group05_APIs.postman_collection.json`
2. Cấu hình environment variables
3. Test theo hướng dẫn trong `HUONG_DAN_TEST_API.md`

### Test Cases Chính:
- ✅ Gửi email reset mật khẩu
- ✅ Reset mật khẩu với token
- ✅ Upload avatar thành công
- ✅ Xóa avatar
- ✅ Validation errors
- ✅ Authentication required

## 📱 Screenshots Yêu Cầu

### 1. Form Forgot Password
- Giao diện form quên mật khẩu
- Email nhận token reset
- Thông báo thành công

### 2. Reset Password UI
- Giao diện đổi mật khẩu với token
- Validation form
- Thông báo thành công

### 3. Upload Avatar
- Giao diện chọn ảnh
- Preview ảnh trước upload
- Thông báo upload thành công
- Avatar hiển thị trong profile

### 4. Postman API Tests
- Test API /forgot-password
- Test API /reset-password  
- Test API /upload-avatar
- Response thành công và error cases

## 🔐 Bảo Mật

- Token reset password có thời hạn 10 phút
- JWT authentication cho upload avatar
- Validation đầy đủ cho tất cả inputs
- File size limit 5MB cho avatar
- Chỉ chấp nhận file hình ảnh

## 🎨 UI/UX Features

- Responsive design cho mobile
- Loading states cho tất cả actions
- Error handling với messages rõ ràng
- Success notifications
- Form validation real-time
- Modern CSS với gradients và animations

## 📊 Database Schema Updates

Model User đã được cập nhật:

```javascript
{
  // ... existing fields
  avatar: String,                    // URL avatar từ Cloudinary
  resetPasswordToken: String,        // Token reset password
  resetPasswordExpires: Date         // Thời hạn token
}
```

## 🚀 Deployment Notes

- Đảm bảo cấu hình đúng environment variables
- Uploads folder có thể được xóa sau deploy
- Cloudinary sẽ lưu trữ tất cả ảnh avatar
- Email service cần internet connection

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. File cấu hình `.env` có đúng không
2. Backend có chạy ở port 3000 không
3. Frontend có chạy ở port 3001 không
4. Kết nối internet cho email và Cloudinary
5. Console logs để debug errors

## 🎯 Kết Quả Đạt Được

✅ **Sinh viên 1**: API /forgot-password, /reset-password, /upload-avatar  
✅ **Sinh viên 2**: Form Forgot Password + Upload Avatar UI  
✅ **Sinh viên 3**: Tích hợp DB với Cloudinary, test reset password  

Tất cả tính năng đã được triển khai hoàn chỉnh với UI đẹp và API đầy đủ!











