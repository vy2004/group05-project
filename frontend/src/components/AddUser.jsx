// 📁 src/components/AddUser.jsx
import { useState } from "react";
import api from "../services/api";

export default function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  // ✅ Gửi request POST tới backend để thêm user vào MongoDB
  const handleAddUser = async () => {
    if (!name || !email || !age) {
      alert("❌ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await api.post("/users", { name, email, age: Number(age) });
      alert("✅ Thêm user thành công!");
      setName("");
      setEmail("");
      setAge("");
      if (onUserAdded) onUserAdded(); // 🔁 reload danh sách
    } catch (err) {
      console.error("❌ Lỗi khi thêm user:", err);
      alert("Thêm user thất bại. Kiểm tra backend!");
    }
  };

  return (
    <div>
      <h3>➕ Thêm user</h3>
      <input
        placeholder="Tên user"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email user"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Tuổi"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={handleAddUser} style={{ marginLeft: 10 }}>
        Thêm user
      </button>
    </div>
  );
}
