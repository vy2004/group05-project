# 🚀 Hướng Dẫn Kích Hoạt Cloudinary Thật

## ✅ Đã hoàn thành:
- [x] Code Cloudinary đã được kích hoạt trong `avatarController.js`
- [x] Bỏ comment code upload thật với Cloudinary
- [x] Cấu hình transformation cho avatar (300x300, crop face, auto quality)

## 🔧 Cần thực hiện:

### **Bước 1: Tạo tài khoản Cloudinary**

1. Truy cập [https://cloudinary.com/](https://cloudinary.com/)
2. Click **"Sign Up For Free"**
3. Điền thông tin đăng ký
4. Xác nhận email

### **Bước 2: Lấy thông tin API**

1. Đăng nhập vào [Cloudinary Dashboard](https://cloudinary.com/console)
2. Trong trang chủ, bạn sẽ thấy:
   - **Cloud Name** (ví dụ: `dxyz123abc`)
   - **API Key** (ví dụ: `123456789012345`)
   - **API Secret** (ví dụ: `abcdefghijklmnopqrstuvwxyz123456`)

### **Bước 3: Tạo file .env**

Tạo file `.env` trong thư mục `backend` với nội dung:

```env
# Cấu hình Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cấu hình Cloudinary - THAY ĐỔI CÁC GIÁ TRỊ NÀY
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret

# Cấu hình JWT
JWT_SECRET=your-jwt-secret-key

# Cấu hình MongoDB (đã có sẵn)
MONGODB_URI=mongodb+srv://tranminhkhang05121964_db_user:CuGgfSW59SWTz9Hz@cluster0.lwvtbtn.mongodb.net/groupDB?retryWrites=true&w=majority&appName=groupDB
```

**⚠️ Quan trọng:** Thay thế các giá trị `your-actual-*` bằng thông tin thật từ Cloudinary Dashboard.

### **Bước 4: Restart Backend Server**

```bash
cd backend
npm start
```

### **Bước 5: Test Upload Avatar**

1. Đăng nhập vào ứng dụng
2. Vào trang Profile
3. Upload avatar mới
4. Kiểm tra URL avatar trong database - sẽ có dạng:
   ```
   https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/group05-avatars/avatar-1234567890.jpg
   ```

## 🎯 Tính năng Cloudinary:

### **Tự động xử lý ảnh:**
- **Resize:** Tự động resize về 300x300px
- **Crop:** Cắt ảnh tập trung vào khuôn mặt
- **Quality:** Tự động tối ưu chất lượng
- **Format:** Tự động chọn format tốt nhất

### **Tổ chức file:**
- Tất cả avatar được lưu trong folder `group05-avatars`
- URL ảnh có versioning tự động
- CDN toàn cầu cho tốc độ tải nhanh

### **Bảo mật:**
- API Secret được bảo vệ trong file .env
- Upload chỉ được phép với token hợp lệ
- Transformation được áp dụng tự động

## 🔍 Kiểm tra hoạt động:

### **1. Kiểm tra log backend:**
```
📸 UPLOAD AVATAR:
User ID: 68f4f0e9654db4e6f9aaf0ed
File: { fieldname: 'avatar', originalname: 'avatar.jpg', ... }
==========================================
```

### **2. Kiểm tra database:**
Avatar URL sẽ có dạng:
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/group05-avatars/avatar-1234567890.jpg
```

### **3. Kiểm tra Cloudinary Dashboard:**
- Vào [Media Library](https://cloudinary.com/console/media_library)
- Tìm folder `group05-avatars`
- Xem ảnh đã upload

## 🚨 Xử lý lỗi thường gặp:

### **Lỗi: "Invalid cloud name"**
- Kiểm tra `CLOUDINARY_CLOUD_NAME` trong file .env
- Đảm bảo không có khoảng trắng thừa

### **Lỗi: "Invalid API credentials"**
- Kiểm tra `CLOUDINARY_API_KEY` và `CLOUDINARY_API_SECRET`
- Copy chính xác từ Dashboard

### **Lỗi: "Upload failed"**
- Kiểm tra kết nối internet
- Kiểm tra file ảnh có hợp lệ không
- Kiểm tra log backend để xem chi tiết lỗi

## 📞 Hỗ trợ:

Nếu gặp vấn đề, hãy:
1. Kiểm tra log backend console
2. Kiểm tra file .env có đúng format không
3. Thử upload ảnh nhỏ (< 1MB) trước
4. Kiểm tra kết nối internet

---

**🎉 Sau khi hoàn thành, avatar sẽ được upload lên Cloudinary thay vì lưu local!**

