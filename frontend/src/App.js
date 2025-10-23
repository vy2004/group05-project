frontend-auth
import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./components/AppContent";
import "./App.css";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>

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
    <div style={{ padding: 20 }}>
      <h1>📚 Quản lý User (Frontend React + MongoDB)</h1>

      {/* 🧩 Form thêm user (truyền callback để báo cho App biết khi thêm user mới) */}
      <AddUser onUserAdded={handleUserAdded} />

      {/* 🧩 Danh sách user (tự reload mỗi khi reloadSignal thay đổi) */}
      <UserList fetchUsersSignal={reloadSignal} />
    </div>
 main
  );
}

export default App;