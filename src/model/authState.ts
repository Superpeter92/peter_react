import { Utente } from "./user";

export interface AuthState {
    user: Utente | null;
    login: (
      email: string,
      password: string,
    ) => Promise<Utente | null>;
    logout: () => void;
    setUser: (user: Utente) => void;
    updateRefresh: (refreshToken: string) => Promise<void>;
  }