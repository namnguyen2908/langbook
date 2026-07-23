'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiGet, apiPost, setApiToken, setOnRefreshFailed } from '@/app/_lib/api';

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
  setAuth: (token: string) => Promise<User | void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getInitialToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('access_token');
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [loading, setLoading] = useState(() => !!getInitialToken());

  useEffect(() => {
    setOnRefreshFailed(() => {
      setToken(null);
      setUser(null);
    });
  }, []);

  useEffect(() => {
    if (!token) return;
    setApiToken(token);
    apiGet('/auth/me')
      .then(setUser)
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const setAuth = useCallback(async (newToken: string) => {
    setApiToken(newToken);
    setToken(newToken);
    setLoading(true);
    sessionStorage.setItem('access_token', newToken);
    try {
      const u = await apiGet('/auth/me');
      setUser(u);
      return u as User;
    } catch {
      setToken(null);
      setUser(null);
      sessionStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }, []);

  const logout = useCallback(async () => {
    await apiPost('/auth/logout');
    setApiToken(null);
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('access_token');
  }, []);

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
