# Group05 Project - Hệ Thống Quản Lý Người Dùng

## 👥 Thành Viên Nhóm

- **Nguyễn Quốc Vỹ** (vy2004) - vy226148@student.nctu.edu.vn
- **Trần Minh Khang** (khang220495-rgb) - khang220495@student.nctu.edu.vn
- **Đỗ Minh Sang** (minhsangdo) - sang221651@student.nctu.edu.vn

---

## 📋 Tổng Quan

Hệ thống quản lý người dùng đầy đủ với các tính năng nâng cao:
- **Authentication & Authorization**: JWT Token, Refresh Token, Role-Based Access Control (RBAC)
- **Quản lý Avatar**: Upload và xóa avatar với Cloudinary, tự động resize ảnh
- **Quên/Reset Mật Khẩu**: Gửi email thật với token reset password
- **Activity Logging**: Ghi lại tất cả hoạt động của người dùng
- **Rate Limiting**: Bảo vệ chống brute-force attack
- **Frontend Redux**: Quản lý state với Redux Toolkit
- **Protected Routes**: Bảo vệ routes dựa trên authentication và role

---

## 🚀 Tính Năng Đã Triển Khai

### 1. Authentication & Authorization
- ✅ Đăng ký (Sign Up)
- ✅ Đăng nhập (Login) với JWT Token
- ✅ Refresh Token tự động
- ✅ Đăng xuất (Logout)
- ✅ Role-Based Access Control (RBAC): Admin, Moderator, User

### 2. Quản Lý Người Dùng
- ✅ Xem danh sách user
- ✅ Tạo user mới
- ✅ Cập nhật thông tin user
- ✅ Xóa user
- ✅ Thay đổi role (chỉ Admin)
- ✅ Quản lý phân quyền chi tiết

### 3. Upload Avatar
- ✅ Upload avatar với Multer
- ✅ Tự động resize ảnh với Sharp (300x300px)
- ✅ Lưu trữ trên Cloudinary
- ✅ Xóa avatar
- ✅ Hiển thị avatar trong Profile

### 4. Quên/Reset Mật Khẩu
- ✅ Gửi email reset password (Gmail SMTP)
- ✅ Reset password với token từ email
- ✅ Token có thời hạn 10 phút
- ✅ Rate limiting cho forgot password

### 5. Activity Logging
- ✅ Ghi lại tất cả hoạt động: login, logout, signup, upload avatar, reset password, etc.
- ✅ Xem logs (chỉ Admin)
- ✅ Lọc logs theo action, success/failure
- ✅ Thống kê logs

### 6. Rate Limiting
- ✅ Rate limit login: 5 lần/15 phút (theo email)
- ✅ Rate limit forgot password: 3 lần/giờ
- ✅ Rate limit signup: 3 lần/giờ
- ✅ Chống brute-force attack

### 7. Frontend Redux
- ✅ Redux Toolkit store
- ✅ Auth slice quản lý token và user info
- ✅ Redux thunks cho API calls
- ✅ Tự động sync với Local Storage

### 8. Protected Routes
- ✅ Protected route `/profile` (yêu cầu authentication)
- ✅ Protected route `/admin` (chỉ Admin)
- ✅ Tự động redirect nếu chưa đăng nhập
- ✅ Hiển thị 403 nếu không có quyền

---

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Node.js** + **Express.js**
- **MongoDB** (MongoDB Atlas)
- **Mongoose** (ODM)
- **JWT** (jsonwebtoken) - Authentication
- **bcrypt** - Hash password
- **Multer** - File upload
- **Sharp** - Image processing
- **Cloudinary** - Image storage
- **Nodemailer** - Email sending
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment variables

### Frontend
- **React** 19.2.0
- **React Router DOM** - Routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **CSS3** - Styling

---

## 📁 Cấu Trúc Dự Án

```
group05-project/
├── backend/
│   ├── config/
│   │   └── email.js                    # Cấu hình Nodemailer
│   ├── controllers/
│   │   ├── authController.js           # Authentication APIs
│   │   ├── userController.js           # User management APIs
│   │   ├── avatarController.js        # Avatar upload/delete
│   │   ├── passwordController.js      # Password reset
│   │   ├── profileController.js       # Profile APIs
│   │   └── logController.js           # Activity logs APIs
│   ├── middleware/
│   │   ├── auth.js                    # JWT authentication
│   │   ├── rbac.js                    # Role-based access control
│   │   ├── logActivity.js             # Activity logging
│   │   └── rateLimiter.js             # Rate limiting
│   ├── models/
│   │   ├── user.js                    # User schema
│   │   ├── refreshToken.js            # Refresh token schema
│   │   └── activityLog.js            # Activity log schema
│   ├── routes/
│   │   ├── auth.js                    # Auth routes
│   │   ├── user.js                    # User routes
│   │   ├── avatar.js                  # Avatar routes
│   │   ├── password.js                # Password routes
│   │   ├── profile.js                 # Profile routes
│   │   └── logs.js                    # Logs routes
│   ├── uploads/                       # Temporary upload folder
│   ├── server.js                      # Main server file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx              # Login component
│   │   │   ├── SignUp.jsx             # Sign up component
│   │   │   ├── ForgotPassword.jsx     # Forgot password form
│   │   │   ├── ResetPassword.jsx     # Reset password form
│   │   │   ├── UploadAvatar.jsx      # Avatar upload
│   │   │   ├── Profile.jsx            # User profile
│   │   │   ├── ProtectedRoute.jsx    # Protected route component
│   │   │   ├── RoleManagement.jsx    # Role management (Admin)
│   │   │   ├── UserManagement.jsx    # User management
│   │   │   ├── AdminPanel.jsx        # Admin panel
│   │   │   ├── ActivityLogs.jsx      # Activity logs (Admin)
│   │   │   └── Permissions.jsx       # Permissions view
│   │   ├── store/
│   │   │   ├── store.js               # Redux store
│   │   │   ├── hooks.js               # Redux hooks
│   │   │   ├── slices/
│   │   │   │   └── authSlice.js      # Auth slice
│   │   │   └── thunks/
│   │   │       └── authThunks.js     # Auth thunks
│   │   ├── services/
│   │   │   └── api.js                 # API service
│   │   └── App.js                     # Main App component
│   └── package.json
│
└── README.md
```

---

## 📦 Cài Đặt

### Yêu Cầu
- **Node.js** >= 16.x
- **npm** >= 8.x
- **MongoDB Atlas** account (hoặc MongoDB local)
- **Cloudinary** account (cho avatar upload)
- **Gmail** account (cho email reset password)

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd group05-project
```

### Bước 2: Cài Đặt Backend Dependencies
```bash
cd backend
npm install
```

### Bước 3: Cài Đặt Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## ⚙️ Cấu Hình Môi Trường

### Backend `.env` File

Tạo file `.env` trong thư mục `backend/`:

```env
# MongoDB Connection (hoặc dùng connection string trong server.js)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/groupDB

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-2024

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3001

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Cấu Hình Gmail App Password

1. Vào [Google Account](https://myaccount.google.com/)
2. Bật **2-Step Verification**
3. Tạo **App Password** cho ứng dụng
4. Copy App Password vào `EMAIL_PASS` trong `.env`

### Cấu Hình Cloudinary

1. Tạo tài khoản tại [Cloudinary](https://cloudinary.com/)
2. Lấy thông tin từ Dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Cập nhật vào `.env`

---

## 🚀 Chạy Ứng Dụng

### Terminal 1: Backend
```bash
cd backend
npm start
```
Backend chạy tại: `http://localhost:3000`

### Terminal 2: Frontend
```bash
cd frontend
npm start
```
Frontend chạy tại: `http://localhost:3001`

---

## 🧪 Test Flow Đầy Đủ

### 1. Đăng Ký (Sign Up)
1. Mở `http://localhost:3001`
2. Click "Đăng ký"
3. Điền thông tin: Name, Email, Password, Age
4. Submit → Thành công

### 2. Đăng Nhập (Login)
1. Điền email và password
2. Click "Đăng nhập"
3. Kiểm tra:
   - Token được lưu trong Local Storage
   - Redux state được cập nhật
   - User được redirect (dựa trên role)

### 3. Refresh Token
1. Token tự động refresh khi hết hạn
2. Kiểm tra Network tab → thấy request `/auth/refresh`

### 4. Upload Avatar
1. Đăng nhập
2. Vào Profile hoặc click "📸 Avatar"
3. Chọn ảnh (jpg, png, max 5MB)
4. Preview → Upload
5. Kiểm tra:
   - Ảnh được resize về 300x300px
   - Avatar URL lưu trong MongoDB
   - Avatar hiển thị trong Profile

### 5. Reset Password
1. Click "🔐 Quên mật khẩu?"
2. Nhập email
3. Check email → Nhận link reset password
4. Click link → Nhập mật khẩu mới
5. Đăng nhập với mật khẩu mới

### 6. Xem Logs (Admin Only)
1. Đăng nhập với tài khoản Admin
2. Click menu ☰ → "📊 Xem Log"
3. Xem danh sách activity logs
4. Test filter: Action, Success/Failure, Search

### 7. Phân Quyền Theo Role

#### Test Protected Routes:
- **User role**: 
  - ✅ Truy cập `/profile` → OK
  - ❌ Truy cập `/admin` → 403 Forbidden

- **Admin role**:
  - ✅ Truy cập `/profile` → OK
  - ✅ Truy cập `/admin` → OK
  - ✅ Xem logs → OK

- **Chưa đăng nhập**:
  - ❌ Truy cập `/profile` → Redirect về login
  - ❌ Truy cập `/admin` → Redirect về login

#### Test Role Management:
1. Đăng nhập với Admin
2. Vào "🔧 Quản Lý Phân Quyền"
3. Đổi role của user khác
4. Test user đó đăng nhập lại → role đã thay đổi

---

## 📡 API Endpoints

### Authentication
- `POST /auth/signup` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/resetpassword/:token` - Reset mật khẩu

### User Management
- `GET /users` - Lấy danh sách users (Admin/Moderator)
- `POST /users` - Tạo user mới (Admin)
- `GET /users/:id` - Lấy thông tin user
- `PUT /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user (Admin)
- `PATCH /users/:id/role` - Đổi role (Admin)

### Avatar
- `POST /avatar/upload` - Upload avatar (Auth required)
- `DELETE /avatar/remove` - Xóa avatar (Auth required)

### Profile
- `GET /profile` - Lấy thông tin profile (Auth required)
- `PUT /profile` - Cập nhật profile (Auth required)

### Activity Logs (Admin Only)
- `GET /logs` - Lấy danh sách logs
- `GET /logs/stats` - Thống kê logs
- `GET /logs/:id` - Lấy chi tiết log
- `DELETE /logs/:id` - Xóa log
- `DELETE /logs` - Xóa nhiều logs

---

## 🔐 Bảo Mật

- ✅ JWT Token với expiration 15 phút
- ✅ Refresh Token với expiration 7 ngày
- ✅ Password được hash với bcrypt (salt rounds: 10)
- ✅ Rate limiting chống brute-force
- ✅ CORS configuration
- ✅ Input validation
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Activity logging cho security audit

---

## 📝 Database Schema

### User Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin', 'moderator'], default: 'user'),
  age: Number,
  avatar: String (URL từ Cloudinary),
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityLog Collection
```javascript
{
  userId: ObjectId (required),
  userEmail: String,
  userName: String,
  action: String (enum: ['login', 'logout', 'signup', ...]),
  ipAddress: String,
  userAgent: String,
  endpoint: String,
  method: String,
  statusCode: Number,
  success: Boolean,
  errorMessage: String,
  metadata: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Các Hoạt Động Đã Hoàn Thành

- ✅ **Hoạt động 1**: Authentication & Authorization (JWT, RBAC)
- ✅ **Hoạt động 2**: User Management với RBAC
- ✅ **Hoạt động 3**: Upload Avatar nâng cao (Sharp + Cloudinary)
- ✅ **Hoạt động 4**: Forgot Password & Reset Password (Email thật)
- ✅ **Hoạt động 5**: User Activity Logging & Rate Limiting
- ✅ **Hoạt động 6**: Frontend Redux & Protected Routes
- ✅ **Hoạt động 7**: Tổng hợp & Merge vào Main

---

## 📚 Tài Liệu Tham Khảo

- `backend/HUONG_DAN_CAU_HINH.md` - Hướng dẫn cấu hình
- `backend/HUONG_DAN_FORGOT_PASSWORD.md` - Hướng dẫn forgot password
- `backend/HUONG_DAN_TEST_API.md` - Hướng dẫn test API
- `backend/CAU_HINH_EMAIL.md` - Hướng dẫn cấu hình email
- `README_NEW_FEATURES.md` - Tính năng mới

---

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB
- Kiểm tra connection string trong `server.js`
- Kiểm tra internet connection
- Kiểm tra MongoDB Atlas whitelist IP

### Lỗi email không gửi được
- Kiểm tra Gmail App Password
- Đảm bảo đã bật 2-Step Verification
- Kiểm tra `EMAIL_USER` và `EMAIL_PASS` trong `.env`

### Lỗi Cloudinary upload
- Kiểm tra Cloudinary credentials trong `.env`
- Kiểm tra file size (max 5MB)
- Kiểm tra file format (jpg, png, jpeg)

### Lỗi CORS
- Đảm bảo frontend chạy ở `http://localhost:3001`
- Đảm bảo backend CORS config đúng origin

### Lỗi Redux state không update
- Kiểm tra Redux DevTools
- Kiểm tra Local Storage
- Kiểm tra console logs

---

## 📞 Liên Hệ

Nếu có vấn đề, vui lòng:
1. Kiểm tra Console logs (F12)
2. Kiểm tra Network tab
3. Kiểm tra file `.env` configuration
4. Xem các file hướng dẫn trong `backend/`

---

## 📄 License

Dự án được phát triển cho mục đích học tập - Group05 Project

---

**Happy Coding! 🚀**
