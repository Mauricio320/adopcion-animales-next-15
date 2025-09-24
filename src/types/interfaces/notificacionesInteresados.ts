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
