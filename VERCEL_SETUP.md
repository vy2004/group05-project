# 🚀 Hướng Dẫn Cấu Hình Vercel cho Frontend

## ❌ Vấn Đề Hiện Tại

Frontend trên Vercel không thể kết nối với backend trên Render vì thiếu biến môi trường `REACT_APP_API_URL`.

## ✅ Giải Pháp

### ⚠️ QUAN TRỌNG: Cấu hình Vercel Settings

Trong **Vercel Dashboard**, bạn PHẢI cấu hình:
1. **Root Directory**: `frontend` (thay vì root)
2. **Build Command**: `npm run build`
3. **Output Directory**: `build`
4. **Install Command**: `npm install`

### Bước 1: Truy Cập Vercel Dashboard

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project **group05-project** (hoặc project của bạn)

### Bước 2: Thêm Environment Variable

1. Vào tab **Settings** → **Environment Variables**
2. Nhấn **Add New**
3. Thêm các biến sau:

| Key | Value | Environment |
|-----|-------|-------------|
| `REACT_APP_API_URL` | `https://group05-project-18.onrender.com` | Production, Preview, Development |

4. Click **Save**

### Bước 3: Redeploy

1. Vào tab **Deployments**
2. Click vào deployment mới nhất
3. Click **•••** (3 dots) → **Redeploy**
4. Chọn **Use existing Build Cache** (tùy chọn)
5. Click **Redeploy**

### Bước 4: Kiểm Tra

Sau khi redeploy xong:
1. Vào trang web của bạn: `https://group05-project-xxx.vercel.app`
2. Mở DevTools Console (F12)
3. Kiểm tra log: `🔗 API Base URL: https://group05-project-18.onrender.com`
4. Thử đăng nhập với:
   - Email: `admin@example.com`
   - Password: `admin123`

## 🔧 Kiểm Tra Backend Render CORS

Đảm bảo backend trên Render đã cấu hình CORS đúng:

```javascript
// backend/server.js
const allowedOrigins = [
  "http://localhost:3001",
  "http://192.168.1.7:3001",
  /^https:\/\/group05-project.*\.vercel\.app$/,  // ✅ Vercel
  /^https:\/\/group05-project.*\.onrender\.com$/ // ✅ Render (nếu cần)
];
```

## 📝 File .env.local cho Development

Để test local, tạo file `frontend/.env.local`:

```env
REACT_APP_API_URL=http://localhost:3000
PORT=3001
```

**Lưu ý:** Không commit file `.env.local` vào git!

## 🧪 Test API Connection

Sau khi cấu hình xong, test API:

```bash
# Test backend Render
curl https://group05-project-18.onrender.com/users

# Kết quả mong đợi: Error về authentication (401) - nghĩa là backend đang chạy ✅
```

## ❗ Lưu Ý Quan Trọng

1. **Backend Render phải chạy** và phản hồi requests
2. **CORS phải được cấu hình** để cho phép Vercel origin
3. **Environment Variables phải được set** trước khi build
4. **Phải redeploy** sau khi thêm env vars

## 🐛 Debug

Nếu vẫn gặp lỗi:

1. Kiểm tra Vercel logs:
   - Vào **Deployments** → Chọn deployment → **Functions** tab
2. Kiểm tra Render logs:
   - Vào [Render Dashboard](https://dashboard.render.com) → Chọn service → **Logs**
3. Kiểm tra Console:
   - Mở DevTools → **Network** tab → Xem failed requests
   - Check **Response Headers** cho CORS errors

## 📞 Support

Nếu vẫn không hoạt động, cung cấp:
- Console errors
- Network tab screenshots
- Backend logs từ Render

