import { IMunicipio } from "./municipio";

export interface IAlbergue {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  celular: string;
  municipio_id: number;
  descripcion: string;
  created_at: string;
  updated_at: string;
  municipio?: IMunicipio
}