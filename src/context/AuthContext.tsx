// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import axios, { AxiosError } from 'axios'; // Ensure AxiosError is imported if using it
import { API_BASE_URL } from '../config/api';

// --- INTERFACES ---
interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// --- CONTEXT CREATION ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- AUTH PROVIDER COMPONENT ---
// The component function starts here:
export const AuthProvider = ({ children }: AuthProviderProps) => {

  // --- STATE DECLARATIONS (setUser and setIsLoggedIn are defined here) ---
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // --- EFFECTS ---
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const response = await api.get('/users/me');
          setUser(response.data);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Failed to load user or token invalid:', error);
          localStorage.removeItem('jwtToken');
          setUser(null);
          setIsLoggedIn(false);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // --- AUTH FUNCTIONS ---
  // These functions are defined within the AuthProvider's scope,
  // so they can access setUser, setIsLoggedIn, etc.

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { usernameOrEmail, password });
      const { jwtToken } = response.data;
      localStorage.setItem('jwtToken', jwtToken);

      const userResponse = await api.get('/users/me');
      setUser(userResponse.data);
      setIsLoggedIn(true);
      console.log('Login successful');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login failed:', error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        console.error('Login failed (JavaScript Error):', error.message);
      } else {
        console.error('Login failed (Unknown Error):', error);
      }
      setIsLoggedIn(false);
      setUser(null);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      console.log('Registration successful:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration failed:', error.response?.data?.message || error.message);
        throw error;
      } else if (error instanceof Error) {
        console.error('Registration failed (JavaScript Error):', error.message);
        throw error;
      } else {
        console.error('Registration failed (Unknown Error):', error);
        throw new Error('An unknown error occurred during registration.');
      }
    }
  };

  const logout = () => { // <--- The 'logout' function starts here
    localStorage.removeItem('jwtToken');
    setUser(null);       // <--- This line is inside logout, which is inside AuthProvider
    setIsLoggedIn(false);
    console.log('Logged out');
  }; // <--- The 'logout' function ends here

  // --- CONDITIONAL RENDERING / FINAL RETURN ---
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );

}; // <--- The AuthProvider component function ends here

// --- CUSTOM HOOK ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};