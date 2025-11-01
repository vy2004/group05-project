// 📁 controllers/userController.js

// ⚙️ Mảng dữ liệu mẫu (tạm thời, chưa kết nối MongoDB)
let users = [
  { id: 1, name: "Nguyen Quoc Vy", email: "vy@example.com", age: 21 },
  { id: 2, name: "Minh Sang", email: "sang@example.com", age: 22 },
];

// 🟢 GET /users — Lấy danh sách user
const getUsers = (req, res) => {
  console.log("📤 Gửi danh sách user:", users);
  res.json(users);
};

// 🟢 POST /users — Thêm user mới
const createUser = (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ message: "❌ Thiếu thông tin user" });
  }

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    age: Number(age),
  };

  users.push(newUser);
  console.log("✅ Thêm user:", newUser);
  res.status(201).json(newUser);
};

// 🟡 PUT /users/:id — Cập nhật thông tin user
const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  const index = users.findIndex((u) => u.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ message: "❌ Không tìm thấy user để cập nhật" });
  }

  // Cập nhật dữ liệu
  users[index] = { ...users[index], name, email, age: Number(age) };
  console.log("✏️ Cập nhật user:", users[index]);
  res.json(users[index]);
};

// 🔴 DELETE /users/:id — Xóa user theo ID
const deleteUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => u.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ message: "❌ Không tìm thấy user để xóa" });
  }

  const deleted = users[index];
  users.splice(index, 1);

  console.log("🗑️ Đã xóa user:", deleted);
  res.json({ message: "🗑️ User đã bị xóa", deleted });
};

// 📦 Xuất module
module.exports = { getUsers, createUser, updateUser, deleteUser };