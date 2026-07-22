'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiGet, apiPost } from '@/app/_lib/api';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  setAuth: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem('access_token');
    if (saved) {
      setToken(saved);
      apiGet('/auth/me', saved)
        .then(setUser)
        .catch(() => { setToken(null); sessionStorage.removeItem('access_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function setAuth(newToken: string) {
    setToken(newToken);
    setLoading(true);
    sessionStorage.setItem('access_token', newToken);
    try {
      const u = await apiGet('/auth/me', newToken);
      setUser(u);
    } catch {
      setToken(null);
      sessionStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  }

  function login() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }

  async function logout() {
    await apiPost('/auth/logout');
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('access_token');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
