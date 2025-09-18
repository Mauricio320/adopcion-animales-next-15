import { ISeguimientosImagenes } from "./seguimientos_imagenes";
import { IUsuario } from "./usuarios";

export interface ISeguimientosAdopcion {
  id?: number;
  solicitud_id?: number;
  observaciones?: string;
  fecha_seguimiento?: string;
  usuario_seguimiento_id?: number;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
  UsuarioSeguimiento?: IUsuario;
  SeguimientosImagenes?: ISeguimientosImagenes[];
}
