import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Load token from local storage on mount
    const storedToken = localStorage.getItem('jwt');
    const storedRole = localStorage.getItem('role');
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  const login = async (username, password) => {
    const response = await axios.post('/api/auth/login', { username, password });
    const { token: jwt } = response.data;
    // Decode role from JWT payload (header.payload.signature)
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    const userRole = payload.role;
    setToken(jwt);
    setRole(userRole);
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('role', userRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}