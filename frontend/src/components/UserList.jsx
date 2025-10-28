// 📁 src/components/UserList.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

frontend-auth
export default function UserList({ reloadSignal, onChanged }) {
export default function UserList({ fetchUsersSignal }) {main
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", email: "", age: "" });

  // 🧩 Hàm tải danh sách user từ backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      // Backend trả về { users: [...], total: ... }
      setUsers(res.data.users || res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách user:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 useEffect gọi API khi component mount hoặc có tín hiệu reload
  useEffect(() => {
    fetchUsers();
frontend-auth
  }, [reloadSignal]);
  }, [fetchUsersSignal]);
main

  // 🧩 Bắt đầu chỉnh sửa user
  const startEdit = (user) => {
    setEditingId(user._id || user.id);
    setEditValues({
      name: user.name ?? "",
      email: user.email ?? "",
      age: user.age ?? "",
    });
  };

  // 🧩 Hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: "", email: "", age: "" });
  };

  // 🧩 Cập nhật giá trị đang chỉnh sửa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  // 🧩 Kiểm tra dữ liệu hợp lệ trước khi lưu
  const validateEdit = () => {
    if (!editValues.name.trim() || !editValues.email.trim()) {
      alert("⚠️ Vui lòng nhập đầy đủ tên và email!");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(editValues.email)) {
      alert("⚠️ Email không hợp lệ!");
      return false;
    }
    if (editValues.age && (Number(editValues.age) <= 0 || Number(editValues.age) > 120)) {
      alert("⚠️ Tuổi phải nằm trong khoảng 1 - 120!");
      return false;
    }
    return true;
  };

  // 🧩 Lưu thay đổi user
  const saveEdit = async (id) => {
    if (!validateEdit()) return;

    try {
      const payload = {
        name: editValues.name,
        email: editValues.email,
        age: editValues.age === "" ? undefined : Number(editValues.age),
      };

      await api.put(`/users/${id}`, payload);
      alert("✅ Cập nhật thành công!");
      setEditingId(null);
      setEditValues({ name: "", email: "", age: "" });
      await fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật user:", err);
      alert("❌ Cập nhật thất bại, thử lại!");
    }
  };

  // 🧩 Xóa user
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này không?")) return;

    try {
      await api.delete(`/users/${id}`);
      alert("🗑️ Xóa thành công!");
      await fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err);
      alert("❌ Xóa thất bại, thử lại!");
    }
  };

  // 🧩 Hiển thị khi đang tải hoặc chưa có user
  if (loading) return <div>⏳ Đang tải dữ liệu...</div>;
  if (!users || users.length === 0) return <div>📭 Chưa có user nào.</div>;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>📋 Danh sách người dùng</h3>
      <table
        className="user-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ background: "#f8f9fa" }}>
          <tr>
            <th style={{ padding: 10 }}>Tên</th>
            <th style={{ padding: 10 }}>Email</th>
            <th style={{ padding: 10, width: 100 }}>Tuổi</th>
            <th style={{ padding: 10 }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const id = u._id || u.id;
            const isEditing = editingId === id;

            return (
              <tr key={id}>
                <td style={{ padding: 8 }}>
                  {isEditing ? (
                    <input
                      name="name"
                      value={editValues.name}
                      onChange={handleChange}
                      style={{ width: "100%", padding: 6, borderRadius: 4 }}
                    />
                  ) : (
                    u.name
                  )}
                </td>

                <td style={{ padding: 8 }}>
                  {isEditing ? (
                    <input
                      name="email"
                      value={editValues.email}
                      onChange={handleChange}
                      style={{ width: "100%", padding: 6, borderRadius: 4 }}
                    />
                  ) : (
                    u.email
                  )}
                </td>

                <td style={{ padding: 8 }}>
                  {isEditing ? (
                    <input
                      name="age"
                      type="number"
                      value={editValues.age}
                      onChange={handleChange}
                      style={{ width: "100%", padding: 6, borderRadius: 4 }}
                    />
                  ) : (
                    u.age ?? "-"
                  )}
                </td>

                <td style={{ padding: 8 }}>
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(id)}
                        style={{
                          background: "#28a745",
                          color: "#fff",
                          border: "none",
                          borderRadius: 5,
                          padding: "6px 10px",
                          marginRight: 6,
                        }}
                      >
                        💾 Lưu
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          background: "#6c757d",
                          color: "#fff",
                          border: "none",
                          borderRadius: 5,
                          padding: "6px 10px",
                        }}
                      >
                        ❌ Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(u)}
                        style={{
                          background: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: 5,
                          padding: "6px 10px",
                          marginRight: 6,
                        }}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        style={{
                          background: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: 5,
                          padding: "6px 10px",
                        }}
                      >
                        🗑️ Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
