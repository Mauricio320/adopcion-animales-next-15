import { supabase } from "@/lib/supabase/client";
import { ISexoAnimal } from "@/types/interfaces/sexoAnimal";

import { useCallback, useEffect, useState } from "react";

export const useSexoAnimal = () => {
  const [sexoAnimal, setSexoAnimal] = useState<ISexoAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSexoAnimal = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("sexo_animal")
        .select("*")
        .order("nombre", { ascending: true });

      if (supabaseError) throw supabaseError;

      setSexoAnimal(data || []);
    } catch (err) {
      console.error("Error fetching sexo animal:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSexoAnimal();
  }, [fetchSexoAnimal]);

  return {
    data: sexoAnimal,
    loading,
    error,
    refetch: fetchSexoAnimal,
  };
};
