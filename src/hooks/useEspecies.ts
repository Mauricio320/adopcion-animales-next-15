import { supabase } from "@/lib/supabase/client";
import { IEspecie } from "@/types/interfaces/especie";

import { useCallback, useEffect, useState } from "react";

export const useEspecies = () => {
  const [especies, setEspecies] = useState<IEspecie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEspecies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("especies")
        .select("*")
        .order("nombre", { ascending: true });

      if (supabaseError) throw supabaseError;

      setEspecies(data || []);
    } catch (err) {
      console.error("Error fetching especies:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEspecies();
  }, [fetchEspecies]);

  return {
    data: especies,
    loading,
    error,
    refetch: fetchEspecies,
  };
};
