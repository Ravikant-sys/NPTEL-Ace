import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nptel_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nptel_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nptel_auth_user');
    }
  }, [user]);

  /**
   * Check if email is in MySQL database.
   * If exists, logs in the user and returns { exists: true, user }.
   * If not, returns { exists: false }.
   */
  const loginWithEmail = async (email) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const data = await res.json();
      if (data.exists && data.user) {
        setUser(data.user);
      }
      return data;
    } catch (err) {
      console.warn('Backend MySQL auth unavailable, using local client fallback:', err);
      const localUsers = JSON.parse(localStorage.getItem('nptel_registered_users') || '[]');
      const found = localUsers.find((u) => u.email === cleanEmail);
      if (found) {
        setUser(found);
        return { success: true, exists: true, user: found };
      }
      return { success: true, exists: false, message: 'Email not registered.' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user with email (and optional name) in MySQL database.
   */
  const registerWithEmail = async (email, name = '') => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, name: cleanName }),
      });
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      }
      return data;
    } catch (err) {
      console.warn('Backend MySQL auth unavailable, using local client fallback:', err);
      const newUser = {
        id: Date.now(),
        email: cleanEmail,
        name: cleanName || cleanEmail.split('@')[0],
      };
      const localUsers = JSON.parse(localStorage.getItem('nptel_registered_users') || '[]');
      if (!localUsers.some((u) => u.email === cleanEmail)) {
        localUsers.push(newUser);
        localStorage.setItem('nptel_registered_users', JSON.stringify(localUsers));
      }
      setUser(newUser);
      return { success: true, user: newUser };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        registerWithEmail,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
