import { IAnimalAlbergue } from "./animalAlbergue";
import { IUsuario } from "./usuarios";

export interface INotificacionesInteresados {
  id?: number;
  animal_albergue_id: number;
  usuario_envia_id: number;
  visto: boolean;
  respuesta?: string | null;
  usuario_responde_id?: number | null;
  created_at: string;
  updated_at: string;
  tipo: number; // 1 para adopción, 2 para apadrinamiento
  aprobado?: boolean | null;
}

export interface INotificacionesInteresadosWithRelations extends INotificacionesInteresados {
  animal_albergue?: IAnimalAlbergue & {
    animal?: {
      id?: number;
      nombre?: string;
      imagen_url?: string;
      especies?: { nombre: string };
      sexo_animal?: { nombre: string };
      edad?: number;
      tipo_edad_animal?: { nombre: string };
    };
  };
  usuario_envia?: IUsuario & {
    numero_documento?: string;
    dv?: string | null;
    celular?: string;
    direccion?: string;
    municipio?: {
      id: number;
      nombre: string;
    };
  };
}
