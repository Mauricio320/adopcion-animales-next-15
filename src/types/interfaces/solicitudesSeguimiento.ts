import { ISeguimientosImagenes } from "./seguimientos_imagenes";
import { IUsuario } from "./usuarios";

export interface ISolicitudesSeguimiento {
  id: number;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
  solicitud_id: number;
  observaciones: string;
  fecha_seguimiento: Date;
  UsuarioSeguimiento: IUsuario;
  SeguimientosImagenes: ISeguimientosImagenes[];
  usuario_seguimiento_id: number;
}


