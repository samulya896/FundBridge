import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'startup' | 'investor') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ACCOUNTS = {
  'startup@fundbridge.com': { role: 'startup', password: 'startup123' },
  'investor@fundbridge.com': { role: 'investor', password: 'investor123' },
  'admin@fundbridge.com': { role: 'admin', password: 'admin123' }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setState({
        user,
        session: { user },
        loading: false,
      });
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  async function signIn(email: string, password: string) {
    const account = DEMO_ACCOUNTS[email as keyof typeof DEMO_ACCOUNTS];
    
    if (!account || password !== account.password) {
      throw new Error('Invalid email or password');
    }

    const user = { email, role: account.role };
    localStorage.setItem('user', JSON.stringify(user));
    setState({
      user,
      session: { user },
      loading: false,
    });
  }

  async function signUp(email: string, password: string, role: 'startup' | 'investor') {
    // Demo registration
    const user = { email, role };
    localStorage.setItem('user', JSON.stringify(user));
    setState({
      user,
      session: { user },
      loading: false,
    });
  }

  async function signOut() {
    localStorage.removeItem('user');
    setState({
      user: null,
      session: null,
      loading: false,
    });
  }

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}