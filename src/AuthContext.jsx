import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth';

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
      
      // Try to fetch attributes, but don't fail if not available
      let attributes = {};
      try {
        attributes = await fetchUserAttributes();
      } catch (attrError) {
        console.log('Could not fetch user attributes:', attrError);
        // Extract email from token as fallback
        const idToken = session.tokens?.idToken;
        if (idToken) {
          const payload = JSON.parse(atob(idToken.toString().split('.')[1]));
          attributes = {
            email: payload.email,
            sub: payload.sub
          };
        }
      }
      
      // Add user attributes (email, name, etc.) to user object
      setUser({
        ...currentUser,
        attributes
      });
      
      const tokens = {
        idToken: session.tokens?.idToken?.toString(),
        accessToken: session.tokens?.accessToken?.toString(),
      };
      
      setTokens(tokens);
      
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
