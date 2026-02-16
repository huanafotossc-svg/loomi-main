import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, CreatorType, VisualTag } from '../types';
import { mockCreators, mockHotels } from '../data/mock';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  selectRole: (role: UserRole, creatorType?: CreatorType, tags?: VisualTag[]) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'loomi_user';

// Safe storage helper
const safeStorage = {
  get: <T,>(key: string, defaultValue: T): T => {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T,>(key: string, value: T): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    const storedUser = safeStorage.get<User | null>(USER_STORAGE_KEY, null);
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // Save user to storage whenever it changes
  useEffect(() => {
    if (user) {
      safeStorage.set(USER_STORAGE_KEY, user);
    } else {
      safeStorage.remove(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check mock data for demo accounts
    const creator = mockCreators.find(c => c.email === email);
    const hotel = mockHotels.find(h => h.email === email);

    if (creator) {
      setUser(creator);
      return true;
    }

    if (hotel) {
      setUser(hotel);
      return true;
    }

    // Demo login for any email
    if (email && password.length >= 4) {
      const demoUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'creator',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(demoUser);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    safeStorage.remove(USER_STORAGE_KEY);
  }, []);

  const selectRole = useCallback((role: UserRole, creatorType?: CreatorType, tags?: VisualTag[]) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        role,
        creatorType,
        tags, // Save tags to user profile
        updatedAt: new Date(),
      };
    });
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
        updatedAt: new Date(),
      };
    });
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    selectRole,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
