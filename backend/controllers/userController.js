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
