import { Ruolo } from "./role";

export interface Utente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  ruolo: Ruolo;
  accessToken: string;
  refreshToken: string;
}
