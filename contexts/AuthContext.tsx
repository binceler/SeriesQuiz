import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface User {
  username: string;
  loginDate: string;
}
interface AuthContextType {
  user: User | null;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadUser();
  }, []);
  const loadUser = async () => {
    try {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } else {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const login = async (username: string) => {
    const userData: User = {
      username,
      loginDate: new Date().toISOString(),
    };
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };
  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      } else {
        await AsyncStorage.removeItem('user');
      }
      setUser(null);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}