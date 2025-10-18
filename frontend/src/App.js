// 📁 src/App.jsx
import { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import "./App.css";

function App() {
  // 🧠 State dùng làm "tín hiệu" reload danh sách user
  const [reloadSignal, setReloadSignal] = useState(false);

  // 🔁 Khi thêm user thành công → đảo trạng thái reloadSignal để UserList re-render
  const handleUserAdded = () => {
    setReloadSignal((prev) => !prev);
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Segoe UI, sans-serif",
        backgroundColor: "#f9fafc",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#0f172a",
          fontSize: 26,
          marginBottom: 20,
        }}
      >
        📚 Quản lý User (Frontend React + MongoDB)
      </h1>

      {/* 🧩 Form thêm user (truyền callback để báo cho App biết khi thêm user mới) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "flex-start",
        }}
      >
        <AddUser onUserAdded={handleUserAdded} />

        {/* 🧩 Danh sách user (tự reload mỗi khi reloadSignal thay đổi) */}
        <div style={{ marginTop: 10 }}>
          <UserList fetchUsersSignal={reloadSignal} />
        </div>
      </div>

      {/* 🧩 Thông báo validation mẫu (frontend thêm) */}
      <footer
        style={{
          marginTop: 30,
          fontSize: 13,
          color: "#666",
          borderTop: "1px solid #ddd",
          paddingTop: 10,
        }}
      >
        ⚡ Validation: không để trống tên, email hợp lệ, tuổi  0.
      </footer>
    </div>
  );
}

export default App;
