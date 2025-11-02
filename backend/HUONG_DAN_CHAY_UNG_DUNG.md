# Hướng Dẫn Chạy Ứng Dụng

## 📋 Yêu Cầu Hệ Thống

- **Node.js** >= 16.x
- **npm** >= 8.x
- **MongoDB Atlas** account (hoặc MongoDB local)
- **Cloudinary** account (cho avatar upload)
- **Gmail** account (cho email reset password)

---

## 📦 Bước 1: Cài Đặt Dependencies

### 1.1 Cài Đặt Backend

Mở Terminal thứ nhất:

```bash
cd backend
npm install
```

**Lưu ý:** Quá trình cài đặt có thể mất vài phút tùy vào tốc độ internet.

### 1.2 Cài Đặt Frontend

Mở Terminal thứ hai:

```bash
cd frontend
npm install
```

**Lưu ý:** Quá trình cài đặt có thể mất vài phút tùy vào tốc độ internet.

---

## ⚙️ Bước 2: Cấu Hình Môi Trường

### 2.1 Tạo File `.env` trong Backend

Tạo file `.env` trong thư mục `backend/`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://tranminhkhang05121964_db_user:CuGgfSW59SWTz9Hz@cluster0.lwvtbtn.mongodb.net/groupDB?retryWrites=true&w=majority&appName=groupDB

# JWT Secret
JWT_SECRET=group05-super-secret-jwt-key-2024

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3001

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2.2 Cấu Hình Gmail App Password

Xem chi tiết trong file `backend/CAU_HINH_EMAIL.md`

**Tóm tắt:**
1. Vào [Google Account](https://myaccount.google.com/)
2. Bật **2-Step Verification**
3. Tạo **App Password** cho ứng dụng
4. Copy App Password vào `EMAIL_PASS` trong `.env`

### 2.3 Cấu Hình Cloudinary

Xem chi tiết trong file `backend/HUONG_DAN_CAU_HINH.md`

**Tóm tắt:**
1. Tạo tài khoản tại [Cloudinary](https://cloudinary.com/)
2. Lấy thông tin từ Dashboard: Cloud Name, API Key, API Secret
3. Cập nhật vào `.env`

---

## 🚀 Bước 3: Chạy Ứng Dụng

### 3.1 Chạy Backend

Trong **Terminal thứ nhất** (đã ở thư mục `backend/`):

```bash
npm start
```

**Kết quả mong đợi:**
```
✅ Kết nối MongoDB thành công
Server đang chạy tại http://localhost:3000
```

### 3.2 Chạy Frontend

Trong **Terminal thứ hai** (đã ở thư mục `frontend/`):

```bash
npm start
```

**Kết quả mong đợi:**
```
Compiled successfully!
You can now view frontend in the browser.
Local:            http://localhost:3001
```

---

## 🎯 Bước 4: Sử Dụng Ứng Dụng

### 4.1 Truy Cập Ứng Dụng

Mở trình duyệt và truy cập: **http://localhost:3001**

### 4.2 Đăng Nhập với Tài Khoản Mẫu

Hệ thống tự động tạo các tài khoản mẫu khi khởi động backend:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Moderator:**
- Email: `moderator@example.com`
- Password: `moderator123`

**User Thường:**
- Email: `user@example.com`
- Password: `user123`

---

## ✅ Kiểm Tra Ứng Dụng Hoạt Động

### Kiểm Tra Backend

Mở trình duyệt và truy cập: **http://localhost:3000**

Sẽ thấy thông báo backend đang chạy (hoặc error nếu chưa cấu hình đúng).

### Kiểm Tra Frontend

Mở trình duyệt và truy cập: **http://localhost:3001**

Sẽ thấy giao diện đăng nhập.

### Kiểm Tra MongoDB

Kiểm tra trong MongoDB Atlas:
- Tài khoản mẫu đã được tạo
- Collections: `users`, `refreshtokens`, `activitylogs`

### Kiểm Tra Logs

Xem logs trong Terminal để kiểm tra:
- Kết nối MongoDB thành công
- Server đang chạy
- Không có lỗi nào

---

## 🛠️ Các Lệnh Hữu Ích

### Restart Backend

Trong Terminal backend:
```bash
# Nhấn Ctrl+C để dừng
# Sau đó chạy lại
npm start
```

### Restart Frontend

Trong Terminal frontend:
```bash
# Nhấn Ctrl+C để dừng
# Sau đó chạy lại
npm start
```

### Clear Node Modules (Nếu cần)

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi 1: MongoDB Connection Failed

**Nguyên nhân:** Connection string không đúng hoặc network issue

**Giải pháp:**
- Kiểm tra `MONGODB_URI` trong `.env` hoặc `server.js`
- Kiểm tra internet connection
- Kiểm tra MongoDB Atlas whitelist IP

### Lỗi 2: Port 3000 Đã Được Sử Dụng

**Nguyên nhân:** Có ứng dụng khác đang chạy ở port 3000

**Giải pháp:**
- Dừng ứng dụng khác đang chạy ở port 3000
- Hoặc đổi port trong `backend/server.js`

### Lỗi 3: Port 3001 Đã Được Sử Dụng

**Nguyên nhân:** Có ứng dụng khác đang chạy ở port 3001

**Giải pháp:**
- Dừng ứng dụng khác đang chạy ở port 3001
- Hoặc đổi port trong `frontend/package.json`

### Lỗi 4: Email Không Gửi Được

**Nguyên nhân:** Gmail App Password không đúng

**Giải pháp:**
- Kiểm tra lại `EMAIL_USER` và `EMAIL_PASS` trong `.env`
- Tạo lại Gmail App Password
- Xem chi tiết trong `backend/CAU_HINH_EMAIL.md`

### Lỗi 5: Cloudinary Upload Thất Bại

**Nguyên nhân:** Cloudinary credentials không đúng

**Giải pháp:**
- Kiểm tra lại `CLOUDINARY_*` trong `.env`
- Xem chi tiết trong `backend/HUONG_DAN_CAU_HINH.md`

---

## 📝 Lưu Ý Quan Trọng

### Development Mode
- Backend sử dụng `nodemon` để tự động restart khi có thay đổi code
- Frontend sử dụng `react-scripts` để hot reload khi có thay đổi

### Environment Variables
- **KHÔNG COMMIT** file `.env` lên Git
- File `.env` đã được thêm vào `.gitignore`

### Temporary Files
- Thư mục `backend/uploads/` chứa file tạm (có thể xóa)
- File tạm sẽ tự động xóa sau khi upload lên Cloudinary

---

## 🔗 Đường Dẫn Quan Trọng

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **Cloudinary Dashboard:** https://cloudinary.com/console

---

## 📚 Tài Liệu Tham Khảo

- `backend/HUONG_DAN_CAU_HINH.md` - Hướng dẫn cấu hình chi tiết
- `backend/CAU_HINH_EMAIL.md` - Hướng dẫn cấu hình email
- `backend/HUONG_DAN_FORGOT_PASSWORD.md` - Hướng dẫn forgot password
- `backend/HUONG_DAN_TEST_API.md` - Hướng dẫn test API với Postman
- `README.md` - Tài liệu tổng quan

---

## 🎉 Hoàn Thành!

Sau khi hoàn thành các bước trên, ứng dụng của bạn đã sẵn sàng sử dụng!

Mở trình duyệt, truy cập **http://localhost:3001** và bắt đầu sử dụng.

**Happy Coding! 🚀**

