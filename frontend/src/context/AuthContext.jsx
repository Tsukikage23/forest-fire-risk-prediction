import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);
const tokenKey = "fireguard_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem(tokenKey)) {
      setLoading(false);
      return;
    }
    api.get("/auth/me").then(({ data }) => setUser(data.user)).catch(() => localStorage.removeItem(tokenKey)).finally(() => setLoading(false));
  }, []);

  async function authenticate(endpoint, credentials) {
    const { data } = await api.post(endpoint, credentials);
    localStorage.setItem(tokenKey, data.token);
    setUser(data.user);
  }

  async function login(credentials) {
    return authenticate("/auth/login", credentials);
  }

  async function register(credentials) {
    return authenticate("/auth/register", credentials);
  }

  function logout() {
    localStorage.removeItem(tokenKey);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
