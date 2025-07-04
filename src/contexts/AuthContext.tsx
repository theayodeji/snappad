// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { parseAxiosError } from '@/lib/parseAxiosError';
import { toast } from 'react-hot-toast';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'owner' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; name?: string; phone?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Initial loading state is true
  const router = useRouter();

  // Effect to load token from localStorage and verify with backend on initial render
  // This useEffect runs once when the AuthProvider component mounts.
  // It handles the asynchronous process of re-establishing authentication state.
  useEffect(() => {
    const loadUserFromToken = async () => {
      setLoading(true); // Set loading to true while checking auth status
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        setToken(storedToken); // Set token immediately for Axios interceptor
        try {
          // Call the /api/auth/me endpoint to verify token and get user data
          // This ensures the token is valid and the user data is fresh from the server.
          const response = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Token was present but invalid/expired according to backend
            console.error('Backend token verification failed:', response.data.message);
            localStorage.removeItem('token'); // Clear invalid token
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (err: any) {
          // Network error, server error, or token verification failed (e.g., 401 from /me endpoint)
          console.error('Error verifying token with backend:', err);
          localStorage.removeItem('token'); // Clear token if verification fails
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false); // Set loading to false once auth check is complete
    };

    loadUserFromToken();
  }, []); // Empty dependency array means this runs once on mount

  // Axios interceptor to attach token to all outgoing requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', credentials);
      if (response.data.success) {
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(userData);
        setIsAuthenticated(true);
        toast.success('Logged in successfully!');
        router.push('/');
      } else {
        toast.error(response.data.message || 'Login failed.');
      }
    } catch (err: any) {
      toast.error(parseAxiosError(err));
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (userData: { email: string; password: string; name?: string; phone?: string }) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', userData);
      if (response.data.success) {
        const { token, user: newUserData } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(newUserData);
        setIsAuthenticated(true);
        toast.success('Account created and logged in!');
        router.push('/');
      } else {
        toast.error(response.data.message || 'Registration failed.');
      }
    } catch (err: any) {
      toast.error(parseAxiosError(err));
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast('Logged out.', { icon: '👋' });
    router.push('/auth/login');
  }, [router]);

  const contextValue = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
