import Axios, { AxiosHeaders } from "axios";
import { useAuth } from "../store/useAuth";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const BASE_URL = `${import.meta.env.VITE_BE}`;
const axiosInstance = Axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
let isLoggedOut = false;

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = useAuth.getState().user?.accessToken;
    if (accessToken) {
      (config.headers as AxiosHeaders).set(
        "Authorization",
        `Bearer ${accessToken}`,
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = useAuth.getState().user?.refreshToken;

    if (error.response?.status === 401 && !originalRequest._retry && !isLoggedOut) {
      originalRequest._retry = true;

      if (isTokenExpired(refreshToken!)) {
        if (!isLoggedOut) {
          isLoggedOut = true;
          useAuth.getState().logout();
          toast.error("Sessione Scaduta", { position: "bottom-center" });
        }
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = useAuth.getState().updateRefresh(refreshToken!)
          .then(() => {
            isRefreshing = false;
            refreshPromise = null;
          })
          .catch((refreshError) => {
            isRefreshing = false;
            refreshPromise = null;
            if (!isLoggedOut) {
              isLoggedOut = true;
              useAuth.getState().logout();
              toast.error("Errore durante il refresh della sessione", { position: "bottom-center" });
            }
            throw refreshError;
          });
      }

      try {
        await refreshPromise;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.data?.error && !isLoggedOut) {
      toast.error(error.response.data.error, { position: "bottom-center" });
    } else if (!isLoggedOut) {
      toast.error("Si è verificato un errore", { position: "bottom-center" });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp ? decoded.exp < Date.now() / 1000 : false;
  } catch (error) {
    return true;
  }
}