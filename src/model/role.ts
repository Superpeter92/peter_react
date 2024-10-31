import { FeatureOptions } from "./feature";

export interface Ruolo {
  id: number;
  nome: string;
  features?: FeatureOptions[];
}

export interface PaginatedRoleResponse {
  roles: Ruolo[];
  currentPage: number;
  totalPages: number;
  totalRoles: number;
}

