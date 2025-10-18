// controllers/userController.js
let users = [
  { id: 1, name: "Nguyen Quoc Vy", email: "vy@example.com" },
  { id: 2, name: "Minh Sang", email: "sang@example.com" }
];

const getUsers = (req, res) => {
  res.json(users);
};

const createUser = (req, res) => {
  const newUser = req.body;
  newUser.id = users.length + 1;
  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = { getUsers, createUser };
const User = require("../models/user");

// GET /users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("GET users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /users
exports.createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Missing name/email" });
    const user = await User.create({ name, email, age });
    res.status(201).json(user);
  } catch (err) {
    console.error("POST user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updated = await User.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    console.error("PUT user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted", id });
  } catch (err) {
    console.error("DELETE user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};