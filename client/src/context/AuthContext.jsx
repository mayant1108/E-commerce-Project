import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { readStorage, writeStorage } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("meesho_clone_token"));
  const [user, setUser] = useState(() => readStorage("meesho_clone_user", null));
  const [loading, setLoading] = useState(false);

  const persistSession = (payload) => {
    localStorage.setItem("meesho_clone_token", payload.token);
    writeStorage("meesho_clone_user", payload.user);
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", credentials);
      persistSession(data);
      toast.success("Welcome back");
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      persistSession(data);
      toast.success("Account created");
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    writeStorage("meesho_clone_user", data.user);
    setUser(data.user);
    toast.success("Profile updated");
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("meesho_clone_token");
    localStorage.removeItem("meesho_clone_user");
    setToken(null);
    setUser(null);
    toast.success("Signed out");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      updateProfile,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
