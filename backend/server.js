// server.js
const express = require('express');
const app = express();

// Cho phép đọc dữ liệu JSON
app.use(express.json());

// ✅ Import route user
const userRouter = require('./routes/user');
app.use('/users', userRouter);

// Cấu hình PORT
const PORT = process.env.PORT || 3000;

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
