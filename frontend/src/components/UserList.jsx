// 📁 src/components/UserList.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

export default function UserList({ reloadFlag }) {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", age: "" });

  // 🟢 Lấy danh sách user từ backend
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách user:", err);
      alert("Không thể tải danh sách user. Kiểm tra backend.");
    }
  };

  // 🔁 Reload danh sách khi reloadFlag thay đổi
  useEffect(() => {
    fetchUsers();
  }, [reloadFlag]);

  // ✏️ Bắt đầu sửa user
  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditData({ name: user.name, email: user.email, age: user.age });
  };

  // ❌ Hủy sửa
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", email: "", age: "" });
  };

  // 💾 Lưu user sau khi sửa (PUT)
  const saveEdit = async (id) => {
    if (!editData.name || !editData.email || !editData.age) {
      alert("❌ Vui lòng nhập đủ thông tin!");
      return;
    }

    try {
      const res = await api.put(`/users/${id}`, {
        name: editData.name,
        email: editData.email,
        age: Number(editData.age),
      });
      alert("✅ Cập nhật user thành công!");
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
      cancelEdit();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật user:", err);
      alert("Không thể cập nhật user!");
    }
  };

  // 🗑️ Xóa user (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này không?")) return;

    try {
      await api.delete(`/users/${id}`);
      alert("🗑️ Đã xóa user!");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err);
      alert("Không thể xóa user!");
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>📋 Danh sách user</h3>

      {users.length === 0 ? (
        <p>Chưa có user nào trong hệ thống.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Tuổi</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>

                {editingId === u._id ? (
                  <>
                    <td>
                      <input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editData.age}
                        onChange={(e) =>
                          setEditData({ ...editData, age: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <button onClick={() => saveEdit(u._id)}>💾 Lưu</button>
                      <button onClick={cancelEdit} style={{ marginLeft: 6 }}>
                        ❌ Hủy
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.age}</td>
                    <td>
                      <button onClick={() => handleEdit(u)}>✏️ Sửa</button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        style={{ marginLeft: 6 }}
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
