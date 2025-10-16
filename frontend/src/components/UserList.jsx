import { useEffect, useState } from "react";
import api from "../services/api";

export default function UserList({ reloadFlag }) {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách user:", error);
      alert("Không thể tải danh sách user. Kiểm tra backend.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reloadFlag]);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>📋 Danh sách user</h3>
      {users.length === 0 ? (
        <p>Chưa có user nào.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
