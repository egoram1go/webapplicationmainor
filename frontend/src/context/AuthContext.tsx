
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { User, LoginRequest, RegisterRequest } from "../types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await authApi.getCurrentUser();

          // Standardize the user data format
          const userData = response.data.user || {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email
          };

          if (!userData?.id) {
            throw new Error("Invalid user data");
          }

          setUser(userData);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("accessToken");
        }
      }
      setLoading(false);
      setInitialized(true);
    };
    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem("accessToken", response.data.token);

      // Standardize user data format
      const userData = response.data.user || {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email
      };
      
      setUser(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);

      const token = response.data.token;
      if (!token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("accessToken", token);

      // Standardize user data
      const user = response.data.user || {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email
      };

      if (!user?.id) {
        throw new Error("Invalid user data");
      }

      setUser(user);
      toast.success("Registration successful");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || error.message || "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    localStorage.removeItem("accessToken");
    setUser(null);
    toast.success("Logout successful");
    navigate("/login");
    setLoading(false);
  };

  // Provide a consistent value reference to avoid unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    initialized,
    login,
    register,
    logout
  }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
