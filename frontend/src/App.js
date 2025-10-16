// src/App.jsx
import { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

export default function App() {
  const [reload, setReload] = useState(0);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Quản lý User (Frontend React)</h1>
      <AddUser onCreated={() => setReload((r) => r + 1)} />
      <UserList reloadFlag={reload} />
    </div>
  );
}
