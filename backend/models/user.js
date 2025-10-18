// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { timestamps: true }); // ✅ thêm dòng này

module.exports = mongoose.model("User", userSchema);
