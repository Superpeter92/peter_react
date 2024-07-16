import axios, { AxiosError } from "axios";
import { Utente } from "../model/user";
import { toast } from "react-toastify";

const BASE_URL = `${import.meta.env.VITE_BE}`;
export async function loginApi(
  email: string,
  password: string,
): Promise<Utente> {
  try {
    const res = await axios.post<Utente>(`${BASE_URL}login`, {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.data) {
      toast.error(err.response?.data.error, { position: "bottom-center" });
      console.log(err);
    }
    return Promise.reject(err);
  }
}

export async function refreshTokenApi(refresh: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  try {
    const res = await axios.post<{
      accessToken: string;
      refreshToken: string;
    }>(`${BASE_URL}refresh-token`, null, {
      headers: {
        Authorization: `Bearer ${refresh}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getUserById(id: string): Promise<Utente> {
  const res = await axios.get<Utente>(`${BASE_URL}user/${id}`);
  return res.data;
}
