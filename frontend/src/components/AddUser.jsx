// 📁 src/components/AddUser.jsx
import { useState } from "react";
import api from "../services/api"; // 🧩 axios instance đã cấu hình sẵn baseURL

export default function AddUser({ fetchUsers }) {
  // 🧠 State quản lý dữ liệu form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧩 Hàm kiểm tra email hợp lệ
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // 🧩 Hàm xử lý khi nhấn "Thêm user"
  const handleAddUser = async (e) => {
    e.preventDefault(); // Ngăn load lại trang khi submit
    setLoading(true);

    // ⚙️ Kiểm tra dữ liệu đầu vào
    if (!name.trim() || !email.trim() || !age.trim()) {
      alert("❌ Vui lòng nhập đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      alert("⚠️ Email không hợp lệ!");
      setLoading(false);
      return;
    }

    if (Number(age) <= 0 || Number(age) > 120) {
      alert("⚠️ Tuổi phải lớn hơn 0 và nhỏ hơn 120!");
      setLoading(false);
      return;
    }

    try {
      console.log("📤 Gửi yêu cầu thêm user:", { name, email, age });

      // 🟢 Gửi request POST tới backend
      const res = await api.post("/users", { name, email, age: Number(age) });

      console.log("✅ Server phản hồi:", res.data);
      alert(`✅ Thêm user thành công: ${res.data.name}`);

      // 🔄 Làm mới danh sách (nhờ hàm từ App.jsx)
      if (fetchUsers) fetchUsers();

      // 🧹 Reset form
      setName("");
      setEmail("");
      setAge("");
    } catch (err) {
      console.error("❌ Lỗi khi thêm user:", err);
      alert("❌ Không thể thêm user. Kiểm tra lại backend hoặc kết nối mạng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAddUser}
      style={{
        border: "1px solid #ccc",
        padding: 20,
        borderRadius: 10,
        width: 300,
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3>➕ Thêm user mới</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          placeholder="👤 Tên user"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
        />
        <input
          placeholder="📧 Email user"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
        />
        <input
          placeholder="🎂 Tuổi"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{ padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 10,
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: 5,
            padding: "8px 10px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "⏳ Đang thêm..." : "➕ Thêm user"}
        </button>
      </div>
    </form>
  );
}
