import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  role: 'doctor' | 'patient' | null;
  user: UserInfo | null;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  login: (token: string, role: 'doctor' | 'patient', user: UserInfo) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<'doctor' | 'patient' | null>(localStorage.getItem('role') as any);
  const [user, setUser] = useState<UserInfo | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = (newToken: string, newRole: 'doctor' | 'patient', newUser: UserInfo) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setRole(newRole);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, role, user, sidebarOpen, setSidebarOpen, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
