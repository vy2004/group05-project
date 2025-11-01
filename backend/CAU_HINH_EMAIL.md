# Cấu Hình Email cho Chức Năng Quên Mật Khẩu

## Bước 1: Tạo file .env

Tạo file `.env` trong thư mục `backend` với nội dung sau:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Bước 2: Cấu hình Gmail

### 2.1 Bật 2-Step Verification
1. Truy cập [Google Account Settings](https://myaccount.google.com/)
2. Vào **Security** → **2-Step Verification**
3. Bật 2-Step Verification nếu chưa có

### 2.2 Tạo App Password
1. Vào **Security** → **App passwords**
2. Chọn **Mail** và **Other (Custom name)**
3. Nhập tên: "Group05 Project"
4. Copy mật khẩu 16 ký tự được tạo
5. Dán vào `EMAIL_PASS` trong file .env

### 2.3 Ví dụ file .env hoàn chỉnh:
```env
EMAIL_USER=sangdo742@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop

JWT_SECRET=your-jwt-secret-key

MONGODB_URI=mongodb+srv://tranminhkhang05121964_db_user:CuGgfSW59SWTz9Hz@cluster0.lwvtbtn.mongodb.net/groupDB?retryWrites=true&w=majority&appName=groupDB
```

## Bước 3: Test

1. Restart backend: `npm start`
2. Thử chức năng quên mật khẩu
3. Kiểm tra email trong hộp thư
4. Kiểm tra console logs để debug

## Lưu ý:
- App Password có dạng: `abcd efgh ijkl mnop` (có khoảng trắng)
- Không sử dụng mật khẩu Gmail thường
- Đảm bảo 2-Step Verification đã được bật











