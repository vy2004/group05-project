// backend/routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/user"); // ✅ Đảm bảo file models/user.js tồn tại

// 🟢 [GET] Lấy toàn bộ user từ MongoDB
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // sắp xếp mới nhất trước
    res.json(users);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách user:", error);
    res.status(500).json({ message: "Lỗi server khi lấy user" });
  }
});

// 🟢 [POST] Thêm user mới vào MongoDB
router.post("/", async (req, res) => {
  try {
    console.log("📥 Nhận user mới:", req.body);
    const { name, email, age } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Thiếu tên hoặc email!" });
    }

    const newUser = new User({ name, email, age });
    await newUser.save();

    console.log("✅ User mới đã lưu:", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("❌ Lỗi khi thêm user:", error);
    res.status(500).json({ message: "Lỗi server khi thêm user" });
  }
});

// 🟠 [PUT] Cập nhật thông tin user theo ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log(`✏️ Cập nhật user ID: ${id}`, updateData);

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user để cập nhật!" });
    }

    console.log("✅ User sau khi cập nhật:", updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật user:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật user" });
  }
});

// 🔴 [DELETE] Xóa user theo ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ Xóa user ID: ${id}`);

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy user để xóa!" });
    }

    console.log("✅ Đã xóa user:", deletedUser);
    res.json({ message: "User đã được xóa thành công!", deletedUser });
  } catch (error) {
    console.error("❌ Lỗi khi xóa user:", error);
    res.status(500).json({ message: "Lỗi server khi xóa user" });
  }
});

module.exports = router;