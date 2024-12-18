import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BaseUrl } from "../../utils/constants";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BaseUrl}/api/auth/login`, {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      return decoded;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      return decoded;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
