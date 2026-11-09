"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  targetRole?: string;
  interviewsCompleted?: number;
  readinessScore?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    targetRole?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Load stored credentials from localStorage safely after initial client mount to prevent SSR hydration mismatches
  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem("auth_user");
      const storedToken = localStorage.getItem("auth_token");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedToken) {
        setToken(storedToken);
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // First attempt to call the backend API if reachable
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          const data = await res.json();
          const authToken = data.access_token || data.token || "mock_jwt_token";
          const userData: User = data.user || {
            id: data.user_id || "usr_" + Math.random().toString(36).substring(2, 9),
            name: data.name || email.split("@")[0],
            email: email,
            targetRole: data.target_role || "Full-Stack Engineer",
            interviewsCompleted: data.interviews_completed || 3,
            readinessScore: data.readiness_score || 88,
          };

          setToken(authToken);
          setUser(userData);
          localStorage.setItem("auth_token", authToken);
          localStorage.setItem("auth_user", JSON.stringify(userData));
          setIsLoading(false);
          return { success: true };
        } else {
          const errData = await res.json().catch(() => ({}));
          // If backend responded with an error (e.g. 401 Unauthorized), return that error
          if (res.status === 400 || res.status === 401 || res.status === 404) {
            setIsLoading(false);
            return {
              success: false,
              error: errData.detail || errData.message || "Invalid email or password",
            };
          }
        }
      } catch {
        // Backend not yet running/configured: fallback gracefully to client mock session
        console.warn("Backend API not reachable at " + API_BASE_URL + ", using local demo session.");
      }

      // Demo/Mock login simulation for frontend testing
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockUserData: User = {
        id: "usr_mock_" + Math.random().toString(36).substring(2, 7),
        name: email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").trim() || "Alex Mercer",
        email: email,
        targetRole: "Senior Full-Stack Engineer",
        interviewsCompleted: 4,
        readinessScore: 92,
      };
      const mockToken = "mock_jwt_token_" + Date.now();

      setToken(mockToken);
      setUser(mockUserData);
      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("auth_user", JSON.stringify(mockUserData));

      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      return { success: false, error: message };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    targetRole?: string
  ) => {
    setIsLoading(true);
    try {
      // First attempt to call the backend API
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            target_role: targetRole || "Full-Stack Engineer",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const authToken = data.access_token || data.token || "mock_jwt_token";
          const userData: User = data.user || {
            id: data.user_id || "usr_" + Math.random().toString(36).substring(2, 9),
            name: name,
            email: email,
            targetRole: targetRole || "Full-Stack Engineer",
            interviewsCompleted: 0,
            readinessScore: 70,
          };

          setToken(authToken);
          setUser(userData);
          localStorage.setItem("auth_token", authToken);
          localStorage.setItem("auth_user", JSON.stringify(userData));
          setIsLoading(false);
          return { success: true };
        } else {
          const errData = await res.json().catch(() => ({}));
          if (res.status === 400 || res.status === 409) {
            setIsLoading(false);
            return {
              success: false,
              error: errData.detail || errData.message || "An account with this email already exists",
            };
          }
        }
      } catch {
        console.warn("Backend API not reachable at " + API_BASE_URL + ", using local demo signup.");
      }

      // Demo/Mock signup simulation
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockUserData: User = {
        id: "usr_mock_" + Math.random().toString(36).substring(2, 7),
        name: name,
        email: email,
        targetRole: targetRole || "Senior Full-Stack Engineer",
        interviewsCompleted: 0,
        readinessScore: 75,
      };
      const mockToken = "mock_jwt_token_" + Date.now();

      setToken(mockToken);
      setUser(mockUserData);
      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("auth_user", JSON.stringify(mockUserData));

      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "An unexpected error occurred during signup.";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
