import { supabase } from "@/lib/supabase/client";
import { IMunicipio } from "@/types/interfaces/municipio";

import { useCallback, useEffect, useState } from "react";

export const useMunicipios = () => {
  const [municipios, setMunicipios] = useState<IMunicipio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMunicipios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("municipios")
        .select("*")
        .order("nombre", { ascending: true });

      if (supabaseError) throw supabaseError;

      setMunicipios(data || []);
    } catch (err) {
      console.error("Error fetching municipios:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMunicipios();
  }, [fetchMunicipios]);

  return {
    data: municipios,
    loading,
    error,
    refetch: fetchMunicipios,
  };
};
