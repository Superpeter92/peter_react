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
  (error) => {
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = useAuth.getState().user?.refreshToken;
    if (error.response?.status === 401) {
      if (isTokenExpired(refreshToken!)) {
        useAuth.getState().logout();
        toast.error("Sessione Scaduta", { position: "bottom-center" });
        return Promise.reject(error);
      } else {
        await useAuth.getState().updateRefresh(refreshToken!);
        return axiosInstance(originalRequest);
      }
    } else {
      toast.error(error.response?.data.errpr, {
        position: "bottom-center",
      });
      return Promise.reject(error);
    }
  },
);

export default axiosInstance;

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return true;
  }
}
