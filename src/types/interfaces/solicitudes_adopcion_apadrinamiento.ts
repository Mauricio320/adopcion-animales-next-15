import { IAnimalAlbergue } from "./animalAlbergue";
import { IEstado } from "./estado";
import { ISeguimientosImagenes } from "./seguimientos_imagenes";
import { ISolicitudesSeguimiento } from "./solicitudesSeguimiento";
import { IUsuarioWithRelations } from "./usuarios";


export interface ISolicitudesAdopcionApadrinamiento {
  id?: number;
  estado_id?: number;
  animal_albergue_id?: number;
  usuario_adoptante_id?: number;
  fecha_solicitud?: string;
  usuario_entrega_id?: number;
  observaciones?: string;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
  Estado?: IEstado;
  AnimalAlbergue?: IAnimalAlbergue;
  UsuarioAdoptante?: IUsuarioWithRelations;
  UsuarioEntrega?: IUsuarioWithRelations;
  SolicitudesImagenes?: ISeguimientosImagenes[];
  SolicitudesSeguimientos?: ISolicitudesSeguimiento[];
}