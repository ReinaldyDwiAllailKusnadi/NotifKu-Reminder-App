import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, User } from '../services/storageService';

interface AuthContextType {
  isLoggedIn: boolean;
  user: Omit<User, 'passwordHash'> | null;
  loginSession: (user: Omit<User, 'passwordHash'>) => Promise<void>;
  logoutSession: () => Promise<void>;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<Omit<User, 'passwordHash'> | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Load session from AsyncStorage on startup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await storageService.getLoginSession();
        setIsLoggedIn(session.isLoggedIn);
        setUser(session.user);
      } catch (error) {
        console.error('Failed to load login session:', error);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    loadSession();
  }, []);

  const loginSession = async (userData: Omit<User, 'passwordHash'>) => {
    setIsLoggedIn(true);
    setUser(userData);
    await storageService.saveLoginSession(userData);
  };

  const logoutSession = async () => {
    setIsLoggedIn(false);
    setUser(null);
    await storageService.clearLoginSession();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loginSession, logoutSession, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
