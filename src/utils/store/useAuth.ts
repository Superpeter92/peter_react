import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Utente } from "../../model/user";
import { AuthState } from "../../model/authState";
import { loginApi, refreshTokenApi } from "../http";
import { toast } from "react-toastify";

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
      { name: "auth", storage: createJSONStorage(() => localStorage) },
    ),
  ),
);
