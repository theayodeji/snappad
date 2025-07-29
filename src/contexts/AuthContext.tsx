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
  role: 'host' | 'guest' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; name?: string; phone?: string, role: 'host' | 'guest'| undefined}) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromToken = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        // --- Defensive check: Ensure storedToken is a string ---
        if (typeof storedToken !== 'string') {
          console.error("AuthContext: Stored token in localStorage is not a string, clearing.", storedToken);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return; // Exit early if token is corrupted
        }

        setToken(storedToken); // Set token immediately for Axios interceptor
        try {
          const response = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            console.error('AuthContext: Backend token verification failed:', response.data.message);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (err: any) {
          console.error('AuthContext: Error verifying token with backend:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, []);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          // Confirming here that 'token' state is indeed a string before sending
          if (typeof token !== 'string') {
            console.error("Axios Interceptor: 'token' state is not a string, aborting header attachment.", token);
            return Promise.reject(new Error("Corrupted token state."));
          }
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
        const receivedToken = response.data.token;
        // --- Defensive check: Ensure receivedToken from API is a string ---
        if (typeof receivedToken !== 'string') {
          console.error("AuthContext: Login API returned a non-string token, aborting.", receivedToken);
          toast.error('Login failed: Invalid token received from server.');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(response.data.user);
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
        const receivedToken = response.data.token;
        // --- Defensive check: Ensure receivedToken from API is a string ---
        if (typeof receivedToken !== 'string') {
          console.error("AuthContext: Register API returned a non-string token, aborting.", receivedToken);
          toast.error('Registration failed: Invalid token received from server.');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(response.data.user);
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
    router.push('/login'); // Changed to /signin for consistency
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
