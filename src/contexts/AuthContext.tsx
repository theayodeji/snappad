// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { parseAxiosError } from "@/lib/parseAxiosError";
import { toast } from "react-hot-toast";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: "host" | "guest" | "admin";
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
    role: "host" | "guest" | undefined;
  }) => Promise<void>;
  logout: () => void;
  verifyOtp: (credentials: { email: string; otp: string }) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const verifyOtp = useCallback(
    async ({ email, otp }: { email: string; otp: string }) => {
      setLoading(true);
      try {
        const response = await axios.post("/api/auth/verify-otp", {
          email,
          otp,
        });

        if (response.data.success) {
          const receivedToken = response.data.token;

          if (typeof receivedToken !== "string") {
            console.error(
              "AuthContext: OTP verification returned a non-string token."
            );
            toast.error("Verification failed: Invalid token received.");
            setLoading(false);
            return;
          }

          localStorage.setItem("token", receivedToken);
          setToken(receivedToken);
          setUser(response.data.user);
          setIsAuthenticated(true);
          toast.success("OTP verified and logged in!");
          if (response.data.user.role === "host") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        } else {
          toast.error(response.data.message || "OTP verification failed.");
        }
      } catch (err: any) {
        toast.error(parseAxiosError(err));
        console.error("OTP verification error:", err);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const resendOtp = useCallback(
    async (email: string) => {
      try {
        const response = await axios.post("/api/auth/resend-otp", { email });

        if (response.data.success) {
          toast.success("OTP resent to your email.");
        } else {
          toast.error(response.data.message || "Failed to resend OTP.");
        }
      } catch (err: any) {
        console.error("Resend OTP error:", err);
        toast.error(
          err?.response?.data?.message ||
            "Something went wrong while resending OTP."
        );
      }
    },
    []
  );

  useEffect(() => {
    const loadUserFromToken = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        // --- Defensive check: Ensure storedToken is a string ---
        if (typeof storedToken !== "string") {
          console.error(
            "AuthContext: Stored token in localStorage is not a string, clearing.",
            storedToken
          );
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return; // Exit early if token is corrupted
        }

        setToken(storedToken); // Set token immediately for Axios interceptor
        try {
          const response = await axios.get("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          const data = response.data;

          if (data.success) {
            if (data.user && !data.user.verified) {
              router.push(`/auth/verify-otp?email=${data.user.email}`);
              return;
            }
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            console.error(
              "AuthContext: Backend token verification failed:",
              data.message
            );
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (err: any) {
          console.error(
            "AuthContext: Error verifying token with backend:",
            err
          );
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, [router]);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          // Confirming here that 'token' state is indeed a string before sending
          if (typeof token !== "string") {
            console.error(
              "Axios Interceptor: 'token' state is not a string, aborting header attachment.",
              token
            );
            return Promise.reject(new Error("Corrupted token state."));
          }
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error("Axios Interceptor: Request error:", error);
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setLoading(true);
      try {
        const response = await axios.post("/api/auth/login", credentials);
        const data = response.data;
        if (data.success) {
          const receivedToken = data.token;
          // --- Defensive check: Ensure receivedToken from API is a string ---
          if (typeof receivedToken !== "string") {
            console.error(
              "AuthContext: Login API returned a non-string token, aborting.",
              receivedToken
            );
            toast.error("Login failed: Invalid token received from server.");
            setLoading(false);
            return;
          }

          localStorage.setItem("token", receivedToken);
          setToken(receivedToken);
          setUser(data.user);
          setIsAuthenticated(true);
          toast.success("Logged in successfully!");
          if (data.user.role === "host") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        } else {
          toast.error(data.message || "Login failed.");
        }
      } catch (err: any) {
        toast.error(parseAxiosError(err));
        console.error("Login error:", err);

        if (
          err.response?.status === 403 &&
          err.response?.data?.requiresVerification
        ) {
          router.push(`/auth/verify-otp?email=${err.response?.data?.email}`);
        }
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (userData: {
      email: string;
      password: string;
      name?: string;
      phone?: string;
      role: "host" | "guest" | undefined;
    }) => {
      setLoading(true);
      try {
        const response = await axios.post("/api/auth/register", userData);

        if (response.data.success) {
          toast.success("Account created! Please verify your OTP.");
          router.push(`/auth/verify-otp?email=${userData.email}`); // Redirect to your OTP verification page
        } else {
          toast.error(response.data.message || "Registration failed.");
        }
      } catch (err: any) {
        toast.error(parseAxiosError(err));
        console.error("Registration error:", err);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast("Logged out.", { icon: "👋" });
    router.push("/auth/login"); // Changed to /signin for consistency
  }, [router]);

  const contextValue = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    verifyOtp,
    resendOtp,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
