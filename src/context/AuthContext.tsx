/**
 * AuthContext — Global authentication state manager.
 *
 * Responsibilities:
 *  1. Track isAuthenticated state reactively across the entire app.
 *  2. Listen for the "auth-logout" event fired by the Axios interceptor
 *     when a refresh token has expired, and gracefully clean up the session.
 *  3. Provide a proper `logout()` function that calls the backend logout
 *     endpoint before clearing local state.
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { storage } from "../utils/storage";
import { apiClient } from "../utils/api-client";
import { ENDPOINTS } from "../constants/endpoints";

interface AuthContextValue {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!storage.get<string>("accessToken") // Initialize from localStorage
  );
  const navigate = useNavigate();

  /**
   * Cleans all local session data and redirects to login.
   * @param message - Optional toast message to show the user.
   */
  const cleanLocalSession = useCallback(
    (message?: string) => {
      storage.remove("accessToken");
      storage.remove("refreshToken");
      delete apiClient.defaults.headers.common.Authorization;
      setIsAuthenticated(false);
      if (message) {
        toast.error(message, { duration: 5000 });
      }
      navigate("/login", { replace: true });
    },
    [navigate]
  );

  /**
   * Global listener for session expiry events dispatched by the Axios interceptor.
   * This is the KEY link between the interceptor and the React state.
   */
  useEffect(() => {
    const handleGlobalLogout = () => {
      cleanLocalSession("Your session has expired. Please log in again.");
    };

    window.addEventListener("auth-logout", handleGlobalLogout);
    return () => window.removeEventListener("auth-logout", handleGlobalLogout);
  }, [cleanLocalSession]);

  /**
   * Manual logout — calls the backend to blacklist the refresh token,
   * then cleans local state.
   */
  const logout = useCallback(async () => {
    try {
      // Send logout request to backend so the refresh token is blacklisted
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT, {});
    } catch (e) {
      // Even if the backend call fails, we still clean up locally
      console.warn("AuthContext: Backend logout failed, cleaning locally.", e);
    } finally {
      cleanLocalSession();
      toast.success("You have been logged out successfully.");
    }
  }, [cleanLocalSession]);

  const value = useMemo(
    () => ({ isAuthenticated, setIsAuthenticated, logout }),
    [isAuthenticated, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
