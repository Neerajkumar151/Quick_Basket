import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { storage } from "./storage";
import { ENDPOINTS } from "../constants/endpoints";

// Determine base URL depending on the framework running
const baseURL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // FIX 1: Send HttpOnly refresh cookie on EVERY request
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) promise.resolve(token);
    else promise.reject(error);
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token dynamically
apiClient.interceptors.request.use((config) => {
  // FIX 3 (part a): Skip attaching Authorization header for auth routes
  if (
    config.url &&
    (config.url.includes(ENDPOINTS.AUTH.LOGIN) ||
      config.url.includes(ENDPOINTS.AUTH.REFRESH) ||
      config.url.includes(ENDPOINTS.AUTH.LOGOUT) ||
      config.url.includes(ENDPOINTS.AUTH.REGISTER))
  ) {
    return config;
  }

  const token = storage.get<string>("accessToken");
  if (token) {
    if (config.headers && typeof (config.headers as any).set === "function") {
      (config.headers as any).set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor: Handle 401 & Silent Token Refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Guard: Handle network failures with no response
    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // FIX 3 (part b): Do NOT attempt refresh if the failing request is itself an auth call
      if (
        originalRequest.url?.includes(ENDPOINTS.AUTH.LOGIN) ||
        originalRequest.url?.includes(ENDPOINTS.AUTH.REFRESH) ||
        originalRequest.url?.includes(ENDPOINTS.AUTH.LOGOUT) ||
        originalRequest.url?.includes(ENDPOINTS.AUTH.REGISTER)
      ) {
        return Promise.reject(error);
      }

      // Guard: Only refresh if a session token actually exists locally
      if (!storage.get("accessToken")) {
        return Promise.reject(error);
      }

      // Queue concurrent requests while refresh is in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers)
              (originalRequest.headers as any).Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Access token expired. Attempting silent token refresh...");

        // FIX 2: Use apiClient (not raw axios) so withCredentials & headers are inherited
        const { data } = await apiClient.post<{ accessToken: string }>(
          ENDPOINTS.AUTH.REFRESH,
          {},
          { withCredentials: true } // explicit belt-and-suspenders
        );

        const newToken = data?.accessToken;

        if (!newToken) {
          throw new Error("Refresh response did not return a valid accessToken.");
        }

        // Persist new access token
        storage.set("accessToken", newToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        // Resolve all queued requests with the new token
        processQueue(null, newToken);

        // Retry the original failed request
        if (originalRequest.headers)
          (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Session expired. Token refresh failed:", refreshError);

        processQueue(refreshError, null);
        storage.remove("accessToken");
        storage.remove("refreshToken");
        delete apiClient.defaults.headers.common.Authorization;

        // FIX 4: Fire a custom event — AuthContext handles cleanup + toast + redirect
        // Do NOT use window.location.href (hard reload bypasses React state cleanup)
        if (typeof window !== "undefined" && storage.get("accessToken") !== null) {
          // accessToken was just removed above, so fire for any authenticated session
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-logout"));
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
