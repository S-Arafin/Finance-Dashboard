import React, { useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../Context/AuthContext';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('financeAuth');
    return savedAuth ? JSON.parse(savedAuth) : { isAuthenticated: false, role: null };
  });

  useEffect(() => {
    localStorage.setItem('financeAuth', JSON.stringify(auth));
  }, [auth]);

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setAuth({ isAuthenticated: true, role: 'admin' });
      return true;
    } else if (username === 'user' && password === 'user') {
      setAuth({ isAuthenticated: true, role: 'user' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, role: null });
  };

  const authValue = useMemo(() => ({
    auth,
    login,
    logout
  }), [auth]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};