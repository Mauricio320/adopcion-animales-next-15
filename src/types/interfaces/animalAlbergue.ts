import { IAlbergue } from "./albergue";
import { IEstado } from "./estado";

export interface IAnimalAlbergue {
  id?: number;
  animal_id?: number;
  es_perdido?: boolean;
  estado_id?: number | null;
  albergue_id?: number;
  created_at?: string;
  updated_at?: string;
  Estado?: IEstado;
  Albergue?: IAlbergue;
}
