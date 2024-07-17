import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Utente } from "../../model/user";
import { AuthState } from "../../model/authState";
import { loginApi, refreshTokenApi } from "../http";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

const SECRET_KEY = `${import.meta.env.VITE_SECRET}`;

const encrypt = (data: Utente) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const useAuth = create<AuthState>()(
  devtools(
    persist(
      (set, get) => {
        return {
          user: null,
          login: async (email: string, password: string) => {
            try {
              const res = await loginApi(email, password);
              return {
                ...get().user,
                id: res.id,
                accessToken: res.accessToken,
                refreshToken: res.refreshToken,
                ruolo: res.ruolo,
                cognome: res.cognome,
                email: res.email,
                nome: res.nome,
              };
            } catch (error) {
              return null;
            }
          },
          logout: () => {
            set(() => ({ user: null }));
          },
          setUser: (user: Utente) => {
            set((state) => ({
              ...state,
              user,
            }));
          },
          updateRefresh: async (refreshToken: string) => {
            try {
              const refreshResponse = await refreshTokenApi(refreshToken);
              console.log(refreshResponse, 'refreshToken state' )
              set((state) => ({
                user: {
                  ...state.user!,
                  accessToken: refreshResponse.accessToken,
                  refreshToken: refreshResponse.refreshToken,
                },
              }));
            } catch (err) {
              toast.error("Sessione Scaduta", {
                position: "bottom-center",
              });
              set(() => ({ user: null }));
              return Promise.reject(err);
            }
          },
        };
      },
      {
        name: "auth",
        storage: createJSONStorage(() => ({
          getItem: (name: string): string | null => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const { state } = JSON.parse(str);
            const decryptedState = {
              ...state,
              user: state.user ? decrypt(state.user) : null,
            };
            return JSON.stringify({ state: decryptedState });
          },
          setItem: (name: string, value: string): void => {
            const { state } = JSON.parse(value);
            const encryptedState = {
              ...state,
              user: state.user ? encrypt(state.user) : null,
            };
            localStorage.setItem(
              name,
              JSON.stringify({ state: encryptedState }),
            );
          },
          removeItem: (name: string): void => {
            localStorage.removeItem(name);
          },
        })),
      },
    ),
  ),
);
