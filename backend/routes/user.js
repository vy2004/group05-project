const express = require("express");
const router = express.Router();

let users = [
  { id: 1, name: "Nguyen Quoc Vy", email: "vy@gmail.com", age: 20 },
  { id: 2, name: "Do Minh Sang", email: "sang@gmail.com", age: 21 },
];

// ✅ Lấy danh sách user
router.get("/", (req, res) => {
  res.json(users);
});

// ✅ Thêm user mới
router.post("/", (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ message: "Thiếu thông tin user!" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    age,
  };

  users.push(newUser); // ✅ LƯU user mới vào mảng
  console.log("📦 Nhận user mới:", newUser);

  res.status(201).json(newUser);
});

module.exports = router;