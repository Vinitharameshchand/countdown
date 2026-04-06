import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '@/constants/config';
import { useRouter, useSegments } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (formData: any) => Promise<void>;
  signUp: (formData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if user is not authenticated and not in auth group
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to home if user is authenticated and in auth group
      router.replace('/(tabs)');
    }
  }, [user, segments]);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync(CONFIG.TOKEN_KEY);
        if (token) {
          // Token exists, could verify it here with an API call
          // For now, assume it's valid or will be caught by first API call
          setUser({ id: '1', email: 'user@example.com', name: 'User' }); // Placeholder
        }
      } catch (err) {
        console.error('Failed to load user', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const signIn = async (formData: any) => {
    try {
      const res = await axios.post(`${CONFIG.API_BASE_URL}/auth/login`, formData);
      const { token, user: userData } = res.data;
      await SecureStore.setItemAsync(CONFIG.TOKEN_KEY, token);
      setUser(userData || { id: '1', email: formData.email, name: 'User' });
    } catch (err) {
      throw err;
    }
  };

  const signUp = async (formData: any) => {
    try {
      const res = await axios.post(`${CONFIG.API_BASE_URL}/auth/signup`, formData);
      const { token, user: userData } = res.data;
      await SecureStore.setItemAsync(CONFIG.TOKEN_KEY, token);
      setUser(userData || { id: '1', email: formData.email, name: formData.name });
    } catch (err) {
      throw err;
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(CONFIG.TOKEN_KEY);
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
