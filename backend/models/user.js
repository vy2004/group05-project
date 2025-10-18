// backend/models/User.js
const mongoose = require("mongoose");

// ✅ Định nghĩa schema cho User
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
  },
  {
    timestamps: true, // Tự tạo createdAt / updatedAt
  }
);

// ✅ Xuất model "User" để dùng trong routes
module.exports = mongoose.model("User", userSchema);