// 📁 src/components/AddUser.jsx
import { useState } from "react";
import api from "../services/api";

export default function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  // 🧩 Hàm kiểm tra email hợp lệ
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // 🧩 Gửi request POST tới backend để thêm user vào MongoDB
  const handleAddUser = async () => {
    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !age) {
      alert("❌ Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (!validateEmail(email)) {
      alert("⚠️ Email không hợp lệ!");
      return;
    }
    if (Number(age) <= 0) {
      alert("⚠️ Tuổi phải lớn hơn 0!");
      return;
    }

    try {
      console.log("📤 Gửi yêu cầu thêm user:", { name, email, age });
      const res = await api.post("/users", { name, email, age: Number(age) });

      console.log("✅ Server phản hồi:", res.data);
      alert(`✅ Thêm user thành công: ${res.data.name}`);

      // Reset form
      setName("");
      setEmail("");
      setAge("");

      // 🔁 Gọi callback để reload danh sách user
      if (onUserAdded) onUserAdded();
    } catch (err) {
      console.error("❌ Lỗi khi thêm user:", err);
      alert("❌ Không thể thêm user. Kiểm tra lại backend hoặc kết nối mạng!");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 15,
        borderRadius: 10,
        width: "fit-content",
      }}
    >
      <h3>➕ Thêm user mới</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          placeholder="👤 Tên user"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="📧 Email user"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="🎂 Tuổi"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button
          onClick={handleAddUser}
          style={{
            marginTop: 8,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 5,
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          ➕ Thêm user
        </button>
      </div>
    </div>
  );
}
