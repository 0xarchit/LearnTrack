import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type UserRole = 'student' | 'faculty' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  department?: string;
  joinDate?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: UserRole;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  initAuth: () => void;
  updateProfile: (profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    department: string;
    joinDate: string;
  }) => Promise<User>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initAuth = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setUser(data as User);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    const res = await fetch(`${API_URL}/api/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    setUser(data as User);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const updateProfile = async (profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    department: string;
    joinDate: string;
  }) => {
    if (!user) throw new Error('Not authenticated');
    const res = await fetch(`${API_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...profile, role: user.role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Profile update failed');
    setUser(data as User);
    localStorage.setItem('user', JSON.stringify(data));
    return data as User;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('Not authenticated');
    const res = await fetch(`${API_URL}/api/users/${user.id}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Password update failed');
  };

  // initialize authentication state from localStorage
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userRole: user?.role || null,
        login,
        register,
        logout,
        initAuth,
        updateProfile,
        changePassword,
      }}
    >
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