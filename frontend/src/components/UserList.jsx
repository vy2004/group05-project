// 📁 src/components/UserList.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

export default function UserList({ reloadFlag }) {
  const [users, setUsers] = useState([]);

  // ✅ Hàm lấy danh sách user từ MongoDB qua backend
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách user:", err);
      alert("Không thể tải danh sách user. Vui lòng kiểm tra backend!");
    }
  };

  // ✅ Mỗi khi reloadFlag thay đổi → tự động tải lại danh sách user
  useEffect(() => {
    fetchUsers();
  }, [reloadFlag]);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>📋 Danh sách user</h3>
      {users.length === 0 ? (
        <p>Chưa có user nào.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Tuổi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id || i}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
