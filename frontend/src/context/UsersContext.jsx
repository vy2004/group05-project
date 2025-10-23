// src/context/UsersContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api";

const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");     // backend GET /users
      setUsers(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Không tải được danh sách user. Kiểm tra backend & CORS.");
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (payload) => {
    // payload: {name, email, age?}
    const res = await api.post("/users", payload);
    // Cách 1: fetch lại server để nhất quán
    await fetchUsers();
    // Cách 2 (tức thời): setUsers((prev) => [res.data, ...prev]);
    return res.data;
  }, [fetchUsers]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return (
    <UsersContext.Provider value={{ users, loading, fetchUsers, addUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => useContext(UsersContext);
