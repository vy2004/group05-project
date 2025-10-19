# Debug Upload Avatar

## Vấn đề hiện tại:
- Lỗi "Không tìm thấy người dùng" khi upload avatar

## Cách debug:

### 1. Kiểm tra Authentication
- Đảm bảo đã đăng nhập trước khi upload
- Kiểm tra token JWT có hợp lệ không

### 2. Kiểm tra Console Logs
Khi upload avatar, kiểm tra console backend để xem:
```
📸 UPLOAD AVATAR:
User ID: [user_id]
User object: [user_object]
File: [file_info]
```

### 3. Các bước test:
1. Đăng nhập vào hệ thống
2. Vào tab "📸 Avatar"
3. Chọn ảnh và upload
4. Kiểm tra console logs

### 4. Nếu vẫn lỗi:
- Kiểm tra xem user có tồn tại trong database không
- Kiểm tra middleware auth có hoạt động không
- Kiểm tra req.user object

### 5. Test với Postman:
```
POST http://localhost:3000/avatar/upload
Headers:
- Authorization: Bearer [your-jwt-token]
- Content-Type: multipart/form-data

Body:
- avatar: [select image file]
```

## Lưu ý:
- File upload giới hạn 5MB
- Chỉ chấp nhận file hình ảnh
- Cần đăng nhập để upload

