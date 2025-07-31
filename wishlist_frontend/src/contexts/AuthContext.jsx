import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const checkCurrentUser = async () => {
    try {
      const response = await authAPI.me();
      setUser(response.data.user);
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setUser(user);
    return response;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setUser(user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
