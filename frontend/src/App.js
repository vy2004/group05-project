// 📁 src/App.js
import { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

function App() {
  const [reloadFlag, setReloadFlag] = useState(false);

  // 🔁 Khi thêm user thành công -> đổi flag để UserList tự load lại
  const handleUserAdded = () => {
    setReloadFlag((prev) => !prev);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📚 Quản lý User (Frontend React + MongoDB)</h1>
      <AddUser onUserAdded={handleUserAdded} />
      <UserList reloadFlag={reloadFlag} />
    </div>
  );
}

export default App;
