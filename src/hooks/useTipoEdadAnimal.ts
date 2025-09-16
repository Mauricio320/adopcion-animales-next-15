import { supabase } from "@/lib/supabase/client";
import { ITipoEdadAnimal } from "@/types/interfaces/tipoEdadAnimal";

import { useCallback, useEffect, useState } from "react";

export const useTipoEdadAnimal = () => {
  const [tipoEdadAnimal, setTipoEdadAnimal] = useState<ITipoEdadAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTipoEdadAnimal = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("tipo_edad_animal")
        .select("*")
        .order("nombre", { ascending: true });

      if (supabaseError) throw supabaseError;

      setTipoEdadAnimal(data || []);
    } catch (err) {
      console.error("Error fetching tipo edad animal:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTipoEdadAnimal();
  }, [fetchTipoEdadAnimal]);

  return {
    data: tipoEdadAnimal,
    loading,
    error,
    refetch: fetchTipoEdadAnimal,
  };
};
