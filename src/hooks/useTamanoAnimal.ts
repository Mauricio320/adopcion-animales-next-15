import { supabase } from "@/lib/supabase/client";
import { ITamanoAnimal } from "@/types/interfaces/tamanoAnimal";

import { useCallback, useEffect, useState } from "react";

export const useTamanoAnimal = () => {
  const [tamanoAnimal, setTamanoAnimal] = useState<ITamanoAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTamanoAnimal = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("tamano_animal")
        .select("*")
        .order("nombre", { ascending: true });

      if (supabaseError) throw supabaseError;

      setTamanoAnimal(data || []);
    } catch (err) {
      console.error("Error fetching tamano animal:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTamanoAnimal();
  }, [fetchTamanoAnimal]);

  return {
    data: tamanoAnimal,
    loading,
    error,
    refetch: fetchTamanoAnimal,
  };
};
