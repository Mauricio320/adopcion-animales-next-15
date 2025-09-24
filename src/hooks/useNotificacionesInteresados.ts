import { supabase } from "@/lib/supabase/client";
import { INotificacionesInteresados } from "@/types/interfaces/notificacionesInteresados";
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
