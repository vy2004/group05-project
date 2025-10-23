# Hướng Dẫn Cấu Hình Backend

## 1. Tạo file .env

Tạo file `.env` trong thư mục `backend` với nội dung sau:

```env
# Cấu hình Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cấu hình Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Cấu hình JWT
JWT_SECRET=your-jwt-secret-key

# Cấu hình MongoDB (đã có trong server.js)
MONGODB_URI=mongodb+srv://tranminhkhang05121964_db_user:CuGgfSW59SWTz9Hz@cluster0.lwvtbtn.mongodb.net/groupDB?retryWrites=true&w=majority&appName=groupDB
```

## 2. Cấu hình Email (Gmail)

### Bước 1: Bật 2-Step Verification
1. Truy cập [Google Account Settings](https://myaccount.google.com/)
2. Vào **Security** → **2-Step Verification**
3. Bật 2-Step Verification nếu chưa có

### Bước 2: Tạo App Password
1. Vào **Security** → **App passwords**
2. Chọn **Mail** và **Other (Custom name)**
3. Nhập tên: "Group05 Project"
4. Copy mật khẩu 16 ký tự được tạo
5. Dán vào `EMAIL_PASS` trong file .env

### Bước 3: Cập nhật .env
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
```

## 3. Cấu hình Cloudinary

### Bước 1: Tạo tài khoản Cloudinary
1. Truy cập [Cloudinary](https://cloudinary.com/)
2. Đăng ký tài khoản miễn phí
3. Vào **Dashboard** để xem thông tin API

### Bước 2: Lấy thông tin API
Trong Dashboard, bạn sẽ thấy:
- Cloud Name
- API Key  
- API Secret

### Bước 3: Cập nhật .env
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 4. Cấu hình JWT Secret

Tạo một chuỗi bí mật ngẫu nhiên cho JWT:

```env
JWT_SECRET=your-super-secret-jwt-key-here
```

## 5. Chạy ứng dụng

Sau khi cấu hình xong:

```bash
# Chạy backend
cd backend
npm start

# Chạy frontend (terminal mới)
cd frontend  
npm start
```

## 6. Test các chức năng

### Quên mật khẩu:
1. Truy cập http://localhost:3001
2. Click "🔐 Quên mật khẩu?"
3. Nhập email và gửi
4. Kiểm tra email để lấy link reset

### Reset mật khẩu:
1. Click vào link trong email
2. Nhập mật khẩu mới
3. Xác nhận mật khẩu

### Upload Avatar:
1. Đăng nhập vào hệ thống
2. Click tab "📸 Avatar"
3. Chọn ảnh và upload

## 7. API Endpoints

### Password Reset:
- `POST /password/forgot` - Gửi email reset mật khẩu
- `POST /password/reset` - Reset mật khẩu với token

### Avatar:
- `POST /avatar/upload` - Upload avatar (cần đăng nhập)
- `DELETE /avatar/remove` - Xóa avatar (cần đăng nhập)

## Lưu ý:
- Đảm bảo file .env không được commit lên Git
- Thay thế tất cả giá trị mẫu bằng thông tin thực của bạn
- Kiểm tra kết nối internet khi test gửi email


