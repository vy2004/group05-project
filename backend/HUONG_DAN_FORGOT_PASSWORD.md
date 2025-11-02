# Hướng Dẫn Sử Dụng Forgot Password & Reset Password

## 📋 Tổng Quan

Hoạt động 4 - Forgot Password & Reset Password (Email thật) cho phép người dùng quên mật khẩu và reset mật khẩu thông qua email thật.

## 👥 Phân Công Nhiệm Vụ

### SV1: Backend API
- API `/auth/forgot-password` - Sinh token và gửi email reset password
- API `/auth/resetpassword/:token` - Reset password với token từ URL

### SV3: Cấu Hình Email
- Cấu hình Nodemailer + Gmail SMTP
- File config: `backend/config/email.js`
- Test script: `backend/test-forgot-password-email.js`

### SV2: Frontend
- Form nhập email quên mật khẩu: `frontend/src/components/ForgotPassword.jsx`
- Form đổi password mới: `frontend/src/components/ResetPassword.jsx`

---

## 🔧 Cấu Hình (SV3)

### 1. Cấu hình Gmail SMTP

Xem file `backend/CAU_HINH_EMAIL.md` để biết cách:
- Tạo App Password từ Gmail
- Cấu hình file `.env`

### 2. File .env cần có:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3001
```

### 3. Test Email Configuration

```bash
cd backend
node test-forgot-password-email.js
```

---

## 📡 API Endpoints (SV1)

### 1. POST /auth/forgot-password

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email reset mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn."
}
```

### 2. POST /auth/resetpassword/:token

**Request:**
```
POST /auth/resetpassword/abc123token456...
Body: {
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mật khẩu đã được đặt lại thành công"
}
```

---

## 💻 Frontend (SV2)

### 1. Form Quên Mật Khẩu

- Component: `ForgotPassword.jsx`
- Route: `/forgot-password`
- Chức năng:
  - Nhập email
  - Gửi request đến `/auth/forgot-password`
  - Hiển thị thông báo thành công

### 2. Form Reset Password

- Component: `ResetPassword.jsx`
- Route: `/reset-password?token=...`
- Chức năng:
  - Lấy token từ URL query parameter
  - Nhập mật khẩu mới và xác nhận
  - Gửi request đến `/auth/resetpassword/:token`
  - Hiển thị thông báo thành công

---

## 🔄 Luồng Hoạt Động

1. **User quên mật khẩu:**
   - User nhập email vào form Forgot Password
   - Frontend gọi API `/auth/forgot-password`
   - Backend sinh token và gửi email với link reset

2. **User nhận email:**
   - Email chứa link: `http://localhost:3001/reset-password?token=...`
   - User click vào link

3. **User reset password:**
   - Frontend hiển thị form Reset Password
   - User nhập mật khẩu mới
   - Frontend gọi API `/auth/resetpassword/:token`
   - Backend cập nhật mật khẩu mới

---

## ⚠️ Lưu Ý

- Token có thời hạn **10 phút**
- Token chỉ sử dụng được **1 lần**
- Sau khi reset password thành công, token sẽ bị xóa
- API cũ `/password/forgot` và `/password/reset` vẫn hoạt động (tương thích ngược)

---

## 🧪 Test

### Test Email Configuration:
```bash
cd backend
node test-forgot-password-email.js
```

### Test API với Postman:
- Import file `Group05_APIs.postman_collection.json`
- Sử dụng collection "Password Reset"

---

## 📁 Cấu Trúc Files

```
backend/
├── config/
│   └── email.js                    # SV3: Email configuration
├── controllers/
│   ├── authController.js           # SV1: Forgot/Reset password APIs
│   └── passwordController.js      # API cũ (vẫn hoạt động)
├── routes/
│   └── auth.js                     # SV1: Routes mới
├── test-forgot-password-email.js  # SV3: Test script
└── CAU_HINH_EMAIL.md               # SV3: Hướng dẫn cấu hình

frontend/src/
├── components/
│   ├── ForgotPassword.jsx          # SV2: Form quên mật khẩu
│   └── ResetPassword.jsx           # SV2: Form reset password
└── services/
    └── api.js                       # API functions
```

