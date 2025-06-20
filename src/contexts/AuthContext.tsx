
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  user_id: string;
  email: string;
  name: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  role_id?: string;
  department_id?: string;
  active?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  getProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:8888';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from token)
    const token = localStorage.getItem('auth_token');
    if (token) {
      keepLogin();
    } else {
      setIsLoading(false);
    }
  }, []);

  const keepLogin = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/hots_auth/keeplogin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = {
          user_id: data.user_id || data.id,
          email: data.email,
          name: data.name || `${data.firstname || ''} ${data.lastname || ''}`.trim(),
          firstname: data.firstname,
          lastname: data.lastname,
          avatar: data.avatar,
          role_id: data.role_id,
          department_id: data.department_id,
          active: data.active,
        };
        setUser(userData);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Keep login error:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const getProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/hots_auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = {
          user_id: data.user_id || data.id,
          email: data.email,
          name: data.name || `${data.firstname || ''} ${data.lastname || ''}`.trim(),
          firstname: data.firstname,
          lastname: data.lastname,
          avatar: data.avatar,
          role_id: data.role_id,
          department_id: data.department_id,
          active: data.active,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Get profile error:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/hots_auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          
          const userData = {
            user_id: data.user?.user_id || data.user?.id,
            email: data.user?.email || email,
            name: data.user?.name || `${data.user?.firstname || ''} ${data.user?.lastname || ''}`.trim(),
            firstname: data.user?.firstname,
            lastname: data.user?.lastname,
            avatar: data.user?.avatar,
            role_id: data.user?.role_id,
            department_id: data.user?.department_id,
            active: data.user?.active,
          };
          
          setUser(userData);
          setIsLoading(false);
          return true;
        }
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    console.log("trying to log out");
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, getProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
