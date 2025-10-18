const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Tên là bắt buộc"] },
    email: { type: String, required: [true, "Email là bắt buộc"] },
    age: { type: Number, required: [true, "Tuổi là bắt buộc"] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);