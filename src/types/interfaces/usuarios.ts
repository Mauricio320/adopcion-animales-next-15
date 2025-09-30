import { IMunicipio } from "./municipio";
import { ISolicitudesAdopcionApadrinamiento } from "./solicitudes_adopcion_apadrinamiento";
import { ITipoDocumento } from "./tipoDocumento";
import { ITipoPersona } from "./tipoPersona";
import { ITipoUsuario } from "./tipoUsuario";

import type { ITipoVoluntario } from "./tipoVoluntario";

export interface IUsuario {
  id?: number;
  nombre?: string;
  apellidos?: string;
  numero_documento?: string;
  dv?: string | null;
  password?: string;
  tipo_usuario_id: number | string;
  tipo_persona_id: number | string;
  tipo_documento_id?: number | string;
  tipo_voluntario_id?: number | string | null;
  municipio_id?: number | string;
  contrasena?: string;
  direccion?: string | null;
  celular?: string | null;
  imagen?: string | null;
  correo?: string | null;
  created_at?: string;
  updated_at?: string;
  auth_id?: string;
  estado?: "activo" | "inactivo" | "bloqueado";
  email_confirmed?: boolean;
  rol?: "usuario" | "staff" | "admin" | "super_admin";
  usuario_albergue?: {
    id: number;
    albergues: {
      id: number;
      imagen?: string | null;
      nombre: string;
      celular?: string;
      telefono?: string;
      direccion?: string;
      created_at: string;
      updated_at: string;
      descripcion?: string;
      municipio_id: number;
      municipio?: IMunicipio;
    };
    es_activo: boolean;
    created_at: string;
    updated_at: string;
    usuario_id: number;
    albergue_id: number;
    es_propietario: boolean;
  };
  solicitudes_adopcion_apadrinamiento_usuario_adoptante?: ISolicitudesAdopcionApadrinamiento[];
  tipo_usuario?: ITipoUsuario;
  tipo_persona?: ITipoPersona;
  tipo_documento?: ITipoDocumento;
  tipo_voluntario?: ITipoVoluntario | null;
  municipio?: IMunicipio;
}

export interface IUsuarioWithRelations extends IUsuario {
  tipo_usuario?: ITipoUsuario;
  tipo_persona?: ITipoPersona;
  tipo_documento?: ITipoDocumento;
  tipo_voluntario?: ITipoVoluntario | null;
  municipio?: IMunicipio;
}
