// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());           // cho phép FE gọi API trong giai đoạn dev
app.use(express.json());   // đọc JSON body

// 1) Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// 2) Import Model
const User = require("./models/User");

// 3) API GET users: trả danh sách từ MongoDB
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 4) API POST users: thêm user vào MongoDB
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    // kiểm tra đơn giản
    if (!name?.trim() || !/\S+@\S+\.\S+/.test(email || "")) {
      return res.status(400).json({ message: "Invalid name or email" });
    }

    const newUser = await User.create({ name: name.trim(), email: email.toLowerCase() });
    res.status(201).json(newUser);
  } catch (err) {
    // lỗi trùng email sẽ vào đây (unique index)
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 5) Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
