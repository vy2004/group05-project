const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Tên là bắt buộc"] },
    email: { type: String, required: [true, "Email là bắt buộc"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Mật khẩu là bắt buộc"] },
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
    age: { type: Number },
    avatar: { type: String, default: '' }, // SV3: Field để lưu URL từ Cloudinary vào MongoDB
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);