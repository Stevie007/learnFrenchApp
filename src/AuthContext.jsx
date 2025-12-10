import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(null);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      setUser(currentUser);
      setTokens({
        idToken: session.tokens?.idToken?.toString(),
        accessToken: session.tokens?.accessToken?.toString(),
      });
    } catch (error) {
      console.log('Not authenticated:', error);
      setUser(null);
      setTokens(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setTokens(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    tokens,
    loading,
    isAuthenticated: !!user,
    checkAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
