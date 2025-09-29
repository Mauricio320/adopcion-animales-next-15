import { supabase } from "@/lib/supabase/client";
import {
  INotificacionesInteresados,
  INotificacionesInteresadosWithRelations,
} from "@/types/interfaces/notificacionesInteresados";
import { useCallback, useEffect, useState } from "react";

import { useRef } from "react";

export const useGetOneNotificacionesInteresados = ({
  animal_albergue_id,
  usuario_envia_id,
}: {
  animal_albergue_id: number;
  usuario_envia_id: number;
}) => {
  const [data, setData] = useState<INotificacionesInteresados>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchData = useCallback(async () => {
    if (hasFetched.current) return; // Evitar doble ejecución
    hasFetched.current = true;

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("notificaciones_interesados")
        .select("*")
        .eq("animal_albergue_id", animal_albergue_id)
        .eq("usuario_envia_id", usuario_envia_id);

      if (supabaseError) throw supabaseError;

      setData(data[0] || undefined);
    } catch (err) {
      console.error("Error fetching notificaciones:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Agregado fetchData para cumplir con las reglas de ESLint

  return { refetch: fetchData, loading, error, data };
};

export const CreateNotificacionInteresadosMutation = async (
  body: INotificacionesInteresados
) => {
  try {
    const { data, error } = await supabase
      .from("notificaciones_interesados")
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Error al crear notificación interesado:", error);
    return { error };
  }
};

export const useGetNotificacionesInteresadosByAlbergue = (
  albergueId: number
) => {
  const [data, setData] = useState<INotificacionesInteresadosWithRelations[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("notificaciones_interesados")
        .select(
          `
          *,
          animal_albergue!inner (
            id,
            albergue_id,
            animal_id,
            activo,
            es_perdido,
            estado_id,
            created_at,
            updated_at,
            animal:animal_id (
              id,
              nombre,
              imagen_url,
              especies:especie_id (nombre),
              sexo_animal:sexo_id (nombre),
              edad,
              tipo_edad_animal:tipo_edad_id (nombre)
            )
          ),
          usuario_envia:usuario_envia_id (
            id,
            nombre,
            apellidos,
            numero_documento,
            dv,
            imagen,
            correo,
            celular,
            direccion,
            municipio:municipio_id (
              id,
              nombre
            )
          )
        `
        )
        .eq("animal_albergue.albergue_id", albergueId);

      if (supabaseError) throw supabaseError;

      setData(data || []);
    } catch (err) {
      console.error("Error fetching notificaciones:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [albergueId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { refetch: fetchData, loading, error, data };
};

export const UpdateNotificacionInteresadosMutation = async (
  id: number,
  body: Partial<INotificacionesInteresados>
) => {
  try {
    const { data, error } = await supabase
      .from("notificaciones_interesados")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Error al actualizar notificación interesado:", error);
    return { error };
  }
};
