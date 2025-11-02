# 🔄 Hướng Dẫn Redeploy để Fix Vấn Đề Vercel

## 📝 Tóm Tắt Vấn Đề

Frontend trên Vercel không kết nối được với backend trên Render vì:
1. ❌ Thiếu Environment Variable `REACT_APP_API_URL` trong Vercel
2. ❌ CORS trong backend chưa cho phép Vercel origin
3. ❌ Backend trên Render chưa update CORS

## ✅ Giải Pháp

### **Bước 1: Thêm Environment Variable trong Vercel**

1. Đăng nhập [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Vào **Settings** → **Environment Variables**
4. **Thêm mới:**
   - Key: `REACT_APP_API_URL`
   - Value: `https://group05-project-18.onrender.com`
   - **Environment**: Chọn tất cả (Production, Preview, Development)
5. Click **Save**

### **Bước 2: Cấu hình Build Settings trong Vercel**

**QUAN TRỌNG!** Vercel cần biết build từ thư mục `frontend`:

1. Vào **Settings** → **General**
2. Scroll xuống **Build & Development Settings**
3. Cập nhật:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
4. Click **Save**

### **Bước 3: Push Code Có CORS Update**

Backend đã có CORS cho Vercel, nhưng cần push lên GitHub để Render có code mới:

```bash
git add .
git commit -m "Add Vercel CORS support and vercel.json config"
git push origin main
```

### **Bước 4: Redeploy Frontend trên Vercel**

1. Trong Vercel Dashboard → **Deployments**
2. Click **•••** (3 dots) → **Redeploy**
3. **Bỏ chọn** "Use existing Build Cache"
4. Click **Redeploy**

### **Bước 5: Redeploy Backend trên Render**

1. Đăng nhập [Render Dashboard](https://dashboard.render.com)
2. Chọn service backend của bạn
3. Click **Manual Deploy** → **Deploy latest commit**

## 🧪 Kiểm Tra

Sau khi redeploy cả hai:

### Test Backend Render

```bash
curl https://group05-project-18.onrender.com/users
# Kết quả: 401 Unauthorized (OK - backend đang chạy)
```

### Test Frontend Vercel

1. Mở trang Vercel của bạn
2. Mở DevTools Console (F12)
3. Kiểm tra log: `🔗 API Base URL: https://group05-project-18.onrender.com`
4. Thử đăng nhập với:
   - Email: `admin@example.com`
   - Password: `admin123`

## 🐛 Nếu Vẫn Lỗi

### Check Console Logs

**Frontend Vercel:**
- Vào **Deployments** → Chọn deployment → **Functions** tab
- Xem build logs

**Backend Render:**
- Vào **Logs** tab
- Check CORS errors

### Check CORS Configuration

Trong `backend/server.js`, đảm bảo có:
```javascript
const allowedOrigins = [
  "http://localhost:3001",
  "http://192.168.1.7:3001",
  /^https:\/\/group05-project.*\.vercel\.app$/
];
```

### Common Issues

1. **Environment Variable không được inject**
   - Phải redeploy sau khi add env var
   - Bỏ "Use existing Build Cache" khi redeploy

2. **Build từ wrong directory**
   - Đảm bảo **Root Directory** = `frontend` trong Vercel

3. **CORS vẫn block**
   - Check backend logs trên Render
   - Check origin trong Network tab DevTools

## 📞 Support Checklist

Khi báo lỗi, cung cấp:
- [ ] Console logs từ Vercel
- [ ] Console logs từ Render
- [ ] Screenshot Network tab (DevTools)
- [ ] Screenshot Environment Variables (Vercel Settings)
- [ ] Screenshot Build Settings (Vercel Settings)

