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


export interface PaginatedUsersResponse {
  users: Utente[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}


export interface UserQueryParams {
  page?: number;
  limit?: number;
  cognome?: string;
  email?: string;
}