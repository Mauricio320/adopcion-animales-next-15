import { supabase } from "@/lib/supabase/client";
import { ISolicitudesAdopcionApadrinamiento } from "@/types/interfaces/solicitudes_adopcion_apadrinamiento";
import { CloneDataHelper } from "@/utils/helpers/clone-data";
import { useCallback, useEffect, useState } from "react";

export interface IUseSolicitudesOptions {
  animal_albergue_id?: number;
  usuario_adoptante_id?: number;
  estado_id?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
}

export const useSolicitudesAdopcion = (
  options: IUseSolicitudesOptions = {}
) => {
  const [solicitudes, setSolicitudes] = useState<
    ISolicitudesAdopcionApadrinamiento[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchSolicitudes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("solicitudes_adopcion_apadrinamiento").select(
        `
          *,
          Estado:estado_animal(*),
          AnimalAlbergue:animal_albergue(*, Estado:estado_animal(*), Albergue:albergues(*)),
          UsuarioAdoptante:usuarios!fk_solicitudes_usuario_adoptante(
            *, tipo_documento: tipos_documento(*),
            municipio: municipios(*)
           ),
          UsuarioEntrega:usuarios!fk_solicitudes_usuario_entrega(*),
          SolicitudesImagenes:solicitudes_imagenes(*),
          SolicitudesSeguimientos:seguimientos_adopcion(
          *, 
          SeguimientosImagenes:seguimientos_imagenes(*), 
          UsuarioSeguimiento:usuarios(*)
          )
        `,
        { count: "exact" }
      );

      if (options.animal_albergue_id) {
        query = query.eq("animal_albergue_id", options.animal_albergue_id);
      }

      if (options.usuario_adoptante_id) {
        query = query.eq("usuario_adoptante_id", options.usuario_adoptante_id);
      }

      if (options.estado_id !== undefined) {
        query = query.eq("estado_id", options.estado_id);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const orderBy = options.orderBy || "created_at";
      query = query.order(orderBy, { ascending: false });

      const { data, error: supabaseError, count } = await query;

      if (supabaseError) throw supabaseError;

      setSolicitudes(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error("Error fetching solicitudes:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const sortSolicitudesBySeguimientos = useCallback(
    (solicitudesToSort: ISolicitudesAdopcionApadrinamiento[]) => {
      return solicitudesToSort.map((solicitud) => ({
        ...solicitud,
        SolicitudesSeguimientos: (solicitud.SolicitudesSeguimientos || []).sort(
          (a, b) => {
            return (b.id || 0) - (a.id || 0);
          }
        ),
      }));
    },
    []
  );

  return {
    sortedData: sortSolicitudesBySeguimientos(solicitudes),
    refetch: fetchSolicitudes,
    data: solicitudes,
    loading,
    error,
    total,
  };
};

// Función separada para crear solicitud
export const CreateSolicitudMutation = async ({
  solicitudData,
}: {
  solicitudData: Omit<
    ISolicitudesAdopcionApadrinamiento,
    "id" | "created_at" | "updated_at"
  >;
}) => {
  try {
    const clone = CloneDataHelper(solicitudData);
    delete clone.SolicitudesSeguimientos;

    const { data, error } = await supabase
      .from("solicitudes_adopcion_apadrinamiento")
      .insert([clone])
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    return { error };
  }
};

// Función separada para actualizar solicitud
export const UpdateSolicitudMutation = async ({
  solicitudId,
  solicitudData,
}: {
  solicitudId: number;
  solicitudData: Partial<ISolicitudesAdopcionApadrinamiento>;
}) => {
  const clone = CloneDataHelper(solicitudData);
  delete clone.SolicitudesSeguimientos;

  try {
    const { data, error } = await supabase
      .from("solicitudes_adopcion_apadrinamiento")
      .update(clone)
      .eq("id", solicitudId)
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Error al actualizar solicitud:", error);
    return { error };
  }
};

export const useSolicitudAdopcion = (id: string | number | undefined) => {
  const [solicitud, setSolicitud] =
    useState<ISolicitudesAdopcionApadrinamiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitud = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("solicitudes_adopcion_apadrinamiento")
        .select(
          `
            *,
            Estado:estado_animal(*),
            AnimalAlbergue:animal_albergue(*, Estado:estado_animal(*), Albergue:albergues(*)),
            UsuarioAdoptante:usuarios!fk_solicitudes_usuario_adoptante(*),
            UsuarioEntrega:usuarios!fk_solicitudes_usuario_entrega(*),
            SolicitudesImagenes:solicitudes_imagenes(*)
          `
        )
        .eq("id", id)
        .single();

      if (supabaseError) throw supabaseError;

      setSolicitud(data);
    } catch (err) {
      console.error("Error fetching solicitud:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSolicitud();
  }, [fetchSolicitud]);

  return {
    refetch: fetchSolicitud,
    data: solicitud,
    loading,
    error,
  };
};
