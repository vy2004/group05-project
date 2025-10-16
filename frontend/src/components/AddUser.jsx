import { useState } from "react";
import api from "../services/api";

export default function AddUser({ onCreated }) {
  const [form, setForm] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users", form);
      alert("✅ Thêm user thành công!");
      setForm({ name: "", email: "" });
      onCreated?.();
    } catch (error) {
      console.error("❌ Lỗi khi thêm user:", error);
      alert("Không thể thêm user. Kiểm tra backend.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>➕ Thêm user</h3>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Tên user"
        style={{ marginRight: 10 }}
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email user"
        style={{ marginRight: 10 }}
      />
      <button type="submit">Thêm user</button>
    </form>
  );
}
