import { Permesso } from "./permission";

export interface Ruolo {
    id: number;
    nome: string;
  permessi?: Permesso[];
  }