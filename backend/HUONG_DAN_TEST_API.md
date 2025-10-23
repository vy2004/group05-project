# Hướng Dẫn Test API với Postman

## 1. Import Collection

1. Mở Postman
2. Click **Import**
3. Chọn file `Group05_APIs.postman_collection.json`
4. Collection sẽ được import với tất cả các API endpoints

## 2. Cấu hình Environment Variables

Trong Postman, tạo Environment với các biến:

```
base_url: http://localhost:3000
auth_token: (để trống, sẽ được set sau khi login)
```

## 3. Test Flow Hoàn Chỉnh

### Bước 1: Test Authentication
```
POST {{base_url}}/auth/login
Body:
{
  "email": "admin@example.com",
  "password": "admin123"
}

Response: Copy token và paste vào biến auth_token
```

### Bước 2: Test Forgot Password
```
POST {{base_url}}/password/forgot
Body:
{
  "email": "admin@example.com"
}

Expected Response:
{
  "success": true,
  "message": "Email reset mật khẩu đã được gửi..."
}
```

### Bước 3: Test Reset Password
```
POST {{base_url}}/password/reset
Body:
{
  "token": "token-từ-email",
  "newPassword": "newpassword123"
}

Expected Response:
{
  "success": true,
  "message": "Mật khẩu đã được đặt lại thành công"
}
```

### Bước 4: Test Upload Avatar
```
POST {{base_url}}/avatar/upload
Headers:
Authorization: Bearer {{auth_token}}
Body: form-data
- avatar: [chọn file ảnh]

Expected Response:
{
  "success": true,
  "message": "Upload avatar thành công",
  "data": {
    "avatar": "https://res.cloudinary.com/...",
    "user": {...}
  }
}
```

### Bước 5: Test Remove Avatar
```
DELETE {{base_url}}/avatar/remove
Headers:
Authorization: Bearer {{auth_token}}

Expected Response:
{
  "success": true,
  "message": "Đã xóa avatar thành công"
}
```

## 4. Test Cases Chi Tiết

### Test Case 1: Forgot Password với email không tồn tại
```
POST {{base_url}}/password/forgot
Body:
{
  "email": "nonexistent@example.com"
}

Expected: 404 với message "Không tìm thấy tài khoản"
```

### Test Case 2: Reset Password với token không hợp lệ
```
POST {{base_url}}/password/reset
Body:
{
  "token": "invalid-token",
  "newPassword": "newpass123"
}

Expected: 400 với message "Token không hợp lệ hoặc đã hết hạn"
```

### Test Case 3: Upload Avatar không có file
```
POST {{base_url}}/avatar/upload
Headers: Authorization: Bearer {{auth_token}}
Body: (empty)

Expected: 400 với message "Vui lòng chọn file ảnh"
```

### Test Case 4: Upload file không phải ảnh
```
POST {{base_url}}/avatar/upload
Headers: Authorization: Bearer {{auth_token}}
Body: form-data với file .txt

Expected: Error với message "Chỉ cho phép upload file hình ảnh"
```

## 5. Screenshots Yêu Cầu

Chụp màn hình các test case sau:

### 5.1 Forgot Password API
- Request: POST /password/forgot với email hợp lệ
- Response: Success message
- Email nhận được trong hộp thư

### 5.2 Reset Password API  
- Request: POST /password/reset với token hợp lệ
- Response: Success message
- Test đăng nhập với mật khẩu mới

### 5.3 Upload Avatar API
- Request: POST /avatar/upload với file ảnh
- Response: Success với URL avatar mới
- Kiểm tra avatar được hiển thị trong frontend

### 5.4 Error Cases
- Forgot password với email không tồn tại
- Reset password với token hết hạn
- Upload avatar không có file

## 6. Lưu Ý Khi Test

1. **Backend phải chạy**: `npm start` trong thư mục backend
2. **Cấu hình .env**: Đảm bảo đã cấu hình email và Cloudinary
3. **Token hết hạn**: Token reset password có thời hạn 10 phút
4. **File size**: Avatar upload giới hạn 5MB
5. **Authentication**: Một số API cần JWT token từ login

## 7. Troubleshooting

### Lỗi kết nối:
- Kiểm tra backend có chạy không (http://localhost:3000)
- Kiểm tra CORS settings

### Lỗi email:
- Kiểm tra cấu hình Gmail App Password
- Kiểm tra EMAIL_USER và EMAIL_PASS trong .env

### Lỗi Cloudinary:
- Kiểm tra cấu hình CLOUDINARY_* trong .env
- Kiểm tra tài khoản Cloudinary có hoạt động không

### Lỗi authentication:
- Đảm bảo đã login và có token hợp lệ
- Kiểm tra Authorization header format: "Bearer {token}"


