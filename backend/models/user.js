const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Tên là bắt buộc"] },
    email: { type: String, required: [true, "Email là bắt buộc"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Mật khẩu là bắt buộc"] },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    age: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);